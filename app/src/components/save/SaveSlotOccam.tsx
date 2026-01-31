import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { tsave } from '../../localization/save';
import { requestManualOverride } from '../../services/guardianShell/manualOverride';
import { triggerDoubleHaptic } from '../../services/haptics/drySeal';
import {
  logSaveNewGamePlus,
  logSaveRecoveryAttempt,
  logSaveSlotDeleted,
  logSaveSlotSelected,
} from '../../services/telemetry/save';
import { useUXPerfEvents } from '@/store/perfStore';
import { useUIStore } from '@/store/uiStore';
import { getGuardianShellTheme } from '../../theme/guardianShell';
import { useSaveLoad } from '@/hooks/useSaveLoad';
import type { SaveSlotId } from '@/services/save/SaveLoadService';
import type { SaveSlot } from '@/store/saveSlotsStore';

const ACTION_ZONE_WIDTH = 48;
const NEW_GAME_PLUS_ID = 'ng-plus';

const formatTimestamp = (iso: string | null) => {
  if (!iso) return '—';
  const date = new Date(iso);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

const formatPlaytime = (minutes: number) => {
  if (!minutes) return '0m';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const hoursPart = hours > 0 ? `${hours}h` : '';
  const minutesPart = mins > 0 ? `${mins}m` : '';
  return `${hoursPart} ${minutesPart}`.trim();
};

const formatDlcFlags = (flags: string[]) => (flags.length ? flags.join(', ') : '—');

const isSaveSlotId = (slotId: string): slotId is SaveSlotId =>
  slotId === 'slot-1' || slotId === 'slot-2' || slotId === 'slot-3';

export const SaveSlotOccam: React.FC = () => {
  const locale = useUIStore((state) => state.locale);
  const highContrast = useUIStore((state) => state.highContrast);
  const setOverlaysVisible = useUIStore((state) => state.setOverlaysVisible);
  const effectsAvailable = useUIStore((state) => state.effectsAvailable);
  const {
    slots,
    actionState,
    error,
    loadFromSlot,
    deleteSlot: deleteSaveSlot,
    recoverSlot,
  } = useSaveLoad();
  const theme = useMemo(() => getGuardianShellTheme(highContrast), [highContrast]);
  const [activeSlotId, setActiveSlotId] = useState<string>(slots[0]?.id ?? NEW_GAME_PLUS_ID);
  const logPerfEvent = useUXPerfEvents((state) => state.logEvent);
  const renderStartRef = useRef<number | null>(
    typeof performance !== 'undefined' && performance.now ? performance.now() : null,
  );
  const fallbackHapticSent = useRef(false);

  const activeSlot = slots.find((slot) => slot.id === activeSlotId);
  const isNewGamePlus = activeSlotId === NEW_GAME_PLUS_ID;

  useEffect(() => {
    setOverlaysVisible(2);
    return () => setOverlaysVisible(0);
  }, [setOverlaysVisible]);

  useEffect(() => {
    if (!effectsAvailable && !fallbackHapticSent.current) {
      triggerDoubleHaptic();
      fallbackHapticSent.current = true;
    }
    if (effectsAvailable) {
      fallbackHapticSent.current = false;
    }
  }, [effectsAvailable]);

  useEffect(() => {
    if (!slots.some((slot) => slot.id === activeSlotId) && !isNewGamePlus) {
      setActiveSlotId(slots[0]?.id ?? NEW_GAME_PLUS_ID);
    }
  }, [slots, activeSlotId, isNewGamePlus]);

  useEffect(() => {
    if (renderStartRef.current == null) return;
    const end = typeof performance !== 'undefined' && performance.now ? performance.now() : null;
    if (!end || !logPerfEvent) return;
    logPerfEvent({
      id: 'save-slot-occam-render',
      durationMs: end - renderStartRef.current,
      timestamp: Date.now(),
    });
    renderStartRef.current = null;
  }, [logPerfEvent]);

  const handleSlotFocus = (slot: SaveSlot) => {
    setActiveSlotId(slot.id);
    logSaveSlotSelected(slot.id, {
      dlcFlags: slot.dlcFlags,
      corrupted: slot.corrupted,
      lastSaveType: slot.lastSaveType,
      timestamp: slot.updatedAt,
    });
  };

  const safeRun = useCallback(async (action: () => Promise<void>) => {
    try {
      await action();
    } catch {
      // Errors are surfaced via notifications in the hook; no-op here.
    }
  }, []);

  const handleSelect = (slot: SaveSlot) => {
    handleSlotFocus(slot);
    if (!isSaveSlotId(slot.id) || slot.corrupted) {
      return;
    }
    void safeRun(() => loadFromSlot(slot.id));
  };

  const handleDelete = (slot: SaveSlot) => {
    if (!isSaveSlotId(slot.id)) {
      return;
    }
    void safeRun(async () => {
      await deleteSaveSlot(slot.id);
      logSaveSlotDeleted(slot.id, { timestamp: Date.now() });
    });
  };

  const handleRecover = (slot: SaveSlot) => {
    if (!isSaveSlotId(slot.id)) {
      return;
    }
    requestManualOverride({ slotId: slot.id, reason: 'corruption' });
    logSaveRecoveryAttempt(slot.id, { dlcFlags: slot.dlcFlags });
    void safeRun(() => recoverSlot(slot.id));
  };

  const handleNewGamePlus = () => {
    setActiveSlotId(NEW_GAME_PLUS_ID);
    logSaveNewGamePlus(NEW_GAME_PLUS_ID, { timestamp: Date.now() });
  };

  const renderSlotCard = (slot: SaveSlot) => {
    const selected = activeSlotId === slot.id;
    const slotAction = actionState.slotId === slot.id ? actionState.type : null;
    return (
      <Pressable
        key={slot.id}
        testID={`save-slot-card-${slot.id}`}
        style={({ pressed }) => [
          styles.slotCard,
          {
            borderColor: selected ? theme.palette.accent : theme.palette.outline,
            backgroundColor: pressed ? theme.palette.panel : 'rgba(255,255,255,0.02)',
          },
        ]}
        onPress={() => handleSlotFocus(slot)}
        disabled={slotAction === 'load'}
        accessibilityRole="button"
        accessibilityState={{ selected }}
      >
        <Text style={[styles.slotTitle, { color: theme.palette.textPrimary }]}> 
          {slot.title ?? tsave(locale, 'emptySlot')}
        </Text>
        <Text style={[styles.slotMeta, { color: theme.palette.textSecondary }]}>
          {formatTimestamp(slot.updatedAt)} · {tsave(locale, slot.lastSaveType === 'manual' ? 'label.manual' : 'label.auto')}
        </Text>
        <Text style={[styles.slotMeta, { color: theme.palette.textSecondary }]}>
          {formatPlaytime(slot.playtimeMinutes)} · DLC: {formatDlcFlags(slot.dlcFlags)}
        </Text>
        {slot.corrupted && (
          <Text style={[styles.corruptionBadge, { color: theme.palette.accent }]}> 
            {tsave(locale, 'status.corrupted')}
          </Text>
        )}
      </Pressable>
    );
  };

  return (
    <LinearGradient
      colors={[theme.palette.background, '#05060d']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.container} testID="occam-save-root">
        <View
          style={[styles.storyTile, { backgroundColor: theme.palette.surface, borderColor: theme.palette.outline }]}
          testID="occam-layer-primary"
        >
          <Text style={[styles.title, { color: theme.palette.primary }]}>{tsave(locale, 'title')}</Text>
          <Text style={[styles.subtitle, { color: theme.palette.textSecondary }]}>
            {tsave(locale, 'subtitle')}
          </Text>
          <View style={styles.slotList}>
            {slots.map((slot) => renderSlotCard(slot))}
            <Pressable
              testID={`save-slot-card-${NEW_GAME_PLUS_ID}`}
              style={({ pressed }) => [
                styles.newGameCard,
                {
                  borderColor: activeSlotId === NEW_GAME_PLUS_ID ? theme.palette.accent : theme.palette.outline,
                  backgroundColor: pressed ? theme.palette.panel : 'rgba(255,255,255,0.02)',
                },
              ]}
              onPress={handleNewGamePlus}
            >
              <Text style={[styles.slotTitle, { color: theme.palette.secondary }]}>
                {tsave(locale, 'overlay.ngPlusTitle')}
              </Text>
              <Text style={[styles.slotMeta, { color: theme.palette.textSecondary }]}>
                {tsave(locale, 'button.newGamePlus')}
              </Text>
            </Pressable>
          </View>
        </View>

        <View
          style={[styles.overlayPanel, { backgroundColor: theme.palette.panel, borderColor: theme.palette.outline }]}
          testID="occam-layer-overlay"
        >
          <View style={styles.overlayContent}>
            <Text style={[styles.overlayHeading, { color: theme.palette.secondary }]}>
              {isNewGamePlus ? tsave(locale, 'overlay.ngPlusTitle') : tsave(locale, 'overlay.detailsTitle')}
            </Text>
            {isNewGamePlus ? (
              <Text style={[styles.overlayBody, { color: theme.palette.textPrimary }]}>
                {tsave(locale, 'button.newGamePlus')}
              </Text>
            ) : (
              <>
                <Text style={[styles.overlayBody, { color: theme.palette.textPrimary }]}>
                  {tsave(locale, 'field.timestamp')}: {formatTimestamp(activeSlot?.updatedAt ?? null)}
                </Text>
                <Text style={[styles.overlayBody, { color: theme.palette.textPrimary }]}>
                  {tsave(locale, 'field.playtime')}: {formatPlaytime(activeSlot?.playtimeMinutes ?? 0)}
                </Text>
                <Text style={[styles.overlayBody, { color: theme.palette.textPrimary }]}>
                  {tsave(locale, 'field.dlc')}: {formatDlcFlags(activeSlot?.dlcFlags ?? [])}
                </Text>
                <Text style={[styles.overlayBody, { color: theme.palette.textPrimary }]}>
                  {tsave(locale, 'field.lastSave')}:{' '}
                  {tsave(locale, activeSlot?.lastSaveType === 'manual' ? 'label.manual' : 'label.auto')}
                </Text>
                <Text style={[styles.overlayBody, { color: theme.palette.textPrimary }]}>
                  {tsave(locale, 'field.status')}:{' '}
                  {activeSlot?.corrupted
                    ? tsave(locale, 'status.corrupted')
                    : tsave(locale, 'status.clean')}
                </Text>
              </>
            )}
            {!effectsAvailable && (
              <Text style={[styles.drySeal, { color: theme.palette.accent }] }>
                {tsave(locale, 'drySeal.fallback')}
              </Text>
            )}
            {error && (
              <Text style={[styles.errorText, { color: theme.palette.danger }]}>{error}</Text>
            )}
          </View>

          <View style={[styles.reachZone, { borderColor: theme.palette.outline }]} testID="reach-zone">
            {!isNewGamePlus && activeSlot && (
              <>
                <ActionButton
                  label={tsave(locale, 'button.select')}
                  onPress={() => handleSelect(activeSlot)}
                  color={theme.palette.primary}
                  testID="action-select"
                  disabled={!isSaveSlotId(activeSlot.id) || (actionState.slotId === activeSlot.id && actionState.type !== null && actionState.type !== 'load')}
                  loading={actionState.slotId === activeSlot.id && actionState.type === 'load'}
                />
                <ActionButton
                  label={tsave(locale, 'button.delete')}
                  onPress={() => handleDelete(activeSlot)}
                  color={theme.palette.textSecondary}
                  testID="action-delete"
                  disabled={!isSaveSlotId(activeSlot.id) || (actionState.slotId === activeSlot.id && actionState.type !== null && actionState.type !== 'delete')}
                  loading={actionState.slotId === activeSlot.id && actionState.type === 'delete'}
                />
                {activeSlot.corrupted && (
                  <ActionButton
                    label={tsave(locale, 'button.recover')}
                    onPress={() => handleRecover(activeSlot)}
                    color={theme.palette.accent}
                    testID="action-recover"
                    disabled={!isSaveSlotId(activeSlot.id) || (actionState.slotId === activeSlot.id && actionState.type !== null && actionState.type !== 'recover')}
                    loading={actionState.slotId === activeSlot.id && actionState.type === 'recover'}
                  />
                )}
              </>
            )}
            {isNewGamePlus && (
              <ActionButton
                label={tsave(locale, 'button.newGamePlus')}
                onPress={handleNewGamePlus}
                color={theme.palette.secondary}
                testID="action-ng-plus"
              />
            )}
            <Text style={[styles.reachHint, { color: theme.palette.textSecondary }]}>
              {tsave(locale, 'reachZone.hint')}
            </Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

type ActionButtonProps = {
  label: string;
  onPress: () => void;
  color: string;
  testID: string;
  disabled?: boolean;
  loading?: boolean;
};

const ActionButton: React.FC<ActionButtonProps> = ({ label, onPress, color, testID, disabled = false, loading = false }) => (
  <Pressable
    style={({ pressed }) => [
      styles.actionButton,
      {
        borderColor: color,
        backgroundColor: pressed && !disabled ? 'rgba(255,255,255,0.08)' : 'transparent',
        opacity: disabled ? 0.4 : 1,
      },
    ]}
    onPress={onPress}
    disabled={disabled || loading}
    testID={testID}
  >
    <Text style={[styles.actionLabel, { color }]} numberOfLines={2}>
      {loading ? '…' : label}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 24,
    gap: 24,
  },
  storyTile: {
    flex: 2,
    borderWidth: 1,
    borderRadius: 24,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 16,
  },
  slotList: {
    gap: 12,
  },
  slotCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },
  slotTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  slotMeta: {
    fontSize: 14,
    marginTop: 4,
  },
  corruptionBadge: {
    marginTop: 8,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  newGameCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    borderStyle: 'dashed',
  },
  overlayPanel: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    gap: 16,
  },
  overlayContent: {
    flex: 1,
    gap: 8,
  },
  overlayHeading: {
    fontSize: 18,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  overlayBody: {
    fontSize: 14,
  },
  drySeal: {
    fontSize: 12,
    marginTop: 12,
  },
  errorText: {
    marginTop: 8,
    fontSize: 12,
  },
  reachZone: {
    width: ACTION_ZONE_WIDTH,
    borderLeftWidth: 1,
    paddingLeft: 8,
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    width: ACTION_ZONE_WIDTH - 8,
    height: ACTION_ZONE_WIDTH - 8,
    borderWidth: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  reachHint: {
    fontSize: 10,
    textAlign: 'center',
  },
});
