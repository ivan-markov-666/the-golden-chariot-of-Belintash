import * as Haptics from 'expo-haptics';

export const triggerDoubleHaptic = async () => {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);
    }, 120);
  } catch (error) {
    console.warn('[haptics] unavailable', error);
  }
};
