import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { withStoreLogger } from './middleware/withStoreLogger';
import { Locale } from '@/theme/guardianShell';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

export interface UIStoreState {
  loading: boolean;
  currentScreen: string;
  modalOpen: boolean;
  modalType: string | null;
  modalData: unknown;
  notifications: Notification[];
  overlaysVisible: number;
  highContrast: boolean;
  locale: Locale;
  effectsAvailable: boolean;
  setLoading: (loading: boolean) => void;
  setCurrentScreen: (screen: string) => void;
  openModal: (type: string, data?: unknown) => void;
  closeModal: () => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  setOverlaysVisible: (value: number) => void;
  setHighContrast: (value: boolean) => void;
  setLocale: (value: Locale) => void;
  setEffectsAvailable: (value: boolean) => void;
}

export const useUIStore = create<UIStoreState>()(
  withStoreLogger(
    devtools(
      (set) => ({
      loading: false,
      currentScreen: 'home',
      modalOpen: false,
      modalType: null,
      modalData: null,
      notifications: [],
      overlaysVisible: 0,
      highContrast: false,
      locale: 'bg',
      effectsAvailable: true,
      setLoading: (loading) => set({ loading }, false, 'ui/setLoading'),
      setCurrentScreen: (screen) => set({ currentScreen: screen }, false, 'ui/setCurrentScreen'),
      openModal: (type, data = null) =>
        set(
          () => ({ modalOpen: true, modalType: type, modalData: data }),
          false,
          `ui/openModal/${type}`,
        ),
      closeModal: () =>
        set(
          () => ({ modalOpen: false, modalType: null, modalData: null }),
          false,
          'ui/closeModal',
        ),
      addNotification: (notification) =>
        set(
          (state) => ({
            notifications: [
              ...state.notifications,
              { ...notification, id: `notif_${Date.now()}_${Math.random().toString(36).slice(2)}` },
            ],
          }),
          false,
          'ui/addNotification',
        ),
      removeNotification: (id) =>
        set(
          (state) => ({ notifications: state.notifications.filter((n) => n.id !== id) }),
          false,
          `ui/removeNotification/${id}`,
        ),
      clearNotifications: () => set({ notifications: [] }, false, 'ui/clearNotifications'),
      setOverlaysVisible: (value) =>
        set(
          (state) => (state.overlaysVisible === value ? state : { overlaysVisible: value }),
          false,
          'ui/setOverlaysVisible',
        ),
      setHighContrast: (value) =>
        set(
          (state) => (state.highContrast === value ? state : { highContrast: value }),
          false,
          'ui/setHighContrast',
        ),
      setLocale: (value) =>
        set(
          (state) => (state.locale === value ? state : { locale: value }),
          false,
          'ui/setLocale',
        ),
      setEffectsAvailable: (value) =>
        set(
          (state) => (state.effectsAvailable === value ? state : { effectsAvailable: value }),
          false,
          'ui/setEffectsAvailable',
        ),
      }),
      { name: 'UIStore' },
    ),
    'UIStore',
  ),
);

export const selectLoading = (state: UIStoreState) => state.loading;
export const selectCurrentScreen = (state: UIStoreState) => state.currentScreen;
export const selectLocale = (state: UIStoreState) => state.locale;
export const selectHighContrast = (state: UIStoreState) => state.highContrast;
export const selectOverlaysVisible = (state: UIStoreState) => state.overlaysVisible;
export const selectEffectsAvailable = (state: UIStoreState) => state.effectsAvailable;
export const selectModal = (state: UIStoreState) => ({
  open: state.modalOpen,
  type: state.modalType,
  data: state.modalData,
});
export const selectNotifications = (state: UIStoreState) => state.notifications;
