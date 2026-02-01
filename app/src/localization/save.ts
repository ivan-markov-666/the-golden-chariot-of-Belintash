import { Locale } from '../theme/guardianShell';

export type SaveCopyKey =
  | 'title'
  | 'subtitle'
  | 'overlay.detailsTitle'
  | 'overlay.ngPlusTitle'
  | 'field.timestamp'
  | 'field.playtime'
  | 'field.dlc'
  | 'field.activeDlc'
  | 'field.missingDlc'
  | 'field.lastSave'
  | 'field.status'
  | 'status.corrupted'
  | 'status.clean'
  | 'label.manual'
  | 'label.auto'
  | 'label.none'
  | 'button.select'
  | 'button.delete'
  | 'button.recover'
  | 'button.newGamePlus'
  | 'warning.missingDlc'
  | 'drySeal.fallback'
  | 'emptySlot'
  | 'reachZone.hint';

const STRINGS: Record<Locale, Record<SaveCopyKey, string>> = {
  bg: {
    title: 'Избор на хроника',
    subtitle: 'Вече подписаните печати и New Game+',
    'overlay.detailsTitle': 'Печатни детайли',
    'overlay.ngPlusTitle': 'New Game+',
    'field.timestamp': 'Последен запис',
    'field.playtime': 'Време в хрониката',
    'field.dlc': 'DLC печати',
    'field.activeDlc': 'Активни DLC',
    'field.missingDlc': 'Липсващи entitlements',
    'field.lastSave': 'Тип запис',
    'field.status': 'Състояние',
    'status.corrupted': 'Корумпиран печат',
    'status.clean': 'Стабилен печат',
    'label.manual': 'Manual',
    'label.auto': 'Auto',
    'label.none': 'Няма',
    'button.select': 'Select',
    'button.delete': 'Delete',
    'button.recover': 'Recover',
    'button.newGamePlus': 'Begin New Game+',
    'warning.missingDlc': 'Записът изисква DLC, които липсват.',
    'drySeal.fallback': 'Dry Seal fallback активен – няма glow/haptic, пази печата.',
    'emptySlot': 'Свободен слaт',
    'reachZone.hint': 'Reach зона ≤48px',
  },
  en: {
    title: 'Select Chronicle',
    subtitle: 'Signed seals and New Game+',
    'overlay.detailsTitle': 'Seal Details',
    'overlay.ngPlusTitle': 'New Game+',
    'field.timestamp': 'Last Write',
    'field.playtime': 'Time in Chronicle',
    'field.dlc': 'DLC Flags',
    'field.activeDlc': 'Active DLC',
    'field.missingDlc': 'Missing entitlements',
    'field.lastSave': 'Save Type',
    'field.status': 'Status',
    'status.corrupted': 'Corrupted Seal',
    'status.clean': 'Stable Seal',
    'label.manual': 'Manual',
    'label.auto': 'Auto',
    'label.none': 'None',
    'button.select': 'Select',
    'button.delete': 'Delete',
    'button.recover': 'Recover',
    'button.newGamePlus': 'Begin New Game+',
    'warning.missingDlc': 'This save requires DLC you do not own.',
    'drySeal.fallback': 'Dry seal fallback active – glow/haptics unavailable.',
    'emptySlot': 'Empty slot',
    'reachZone.hint': 'Reach zone ≤48px',
  },
};

export const tsave = (locale: Locale, key: SaveCopyKey): string => STRINGS[locale][key];
