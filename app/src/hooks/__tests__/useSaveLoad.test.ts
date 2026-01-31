import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useSaveLoad } from '@/hooks/useSaveLoad';
import { useSaveSlots } from '@/store/saveSlotsStore';
import { useUIStore } from '@/store/uiStore';

const mockService = {
  getSaveSlots: jest.fn(async () => []),
  saveGame: jest.fn(async () => {}),
  loadGame: jest.fn(async () => {}),
  deleteSave: jest.fn(async () => {}),
};

jest.mock('@/services/save/SaveLoadService', () => ({
  SaveLoadService: {
    getInstance: () => mockService,
  },
}));

describe('useSaveLoad hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockService.getSaveSlots.mockResolvedValue([]);
    mockService.saveGame.mockResolvedValue(undefined);
    mockService.loadGame.mockResolvedValue(undefined);
    mockService.deleteSave.mockResolvedValue(undefined);

    act(() => {
      useSaveSlots.getState().reset();
      useUIStore.getState().clearNotifications();
      useUIStore.setState((state) => ({
        ...state,
        addNotification: state.addNotification,
      }));
    });
  });

  it('автоматично рефрешва слотовете при mount и връща стабилно action state', async () => {
    const { result } = renderHook(() => useSaveLoad());

    await waitFor(() => expect(mockService.getSaveSlots).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.actionState.type).toBeNull();
  });

  it('saveToSlot делегира към SaveLoadService и добавя success нотификация', async () => {
    const { result } = renderHook(() => useSaveLoad());
    await waitFor(() => expect(mockService.getSaveSlots).toHaveBeenCalled());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.saveToSlot('slot-1');
    });

    expect(mockService.saveGame).toHaveBeenCalledWith('slot-1', 'manual');
    const notifications = useUIStore.getState().notifications;
    expect(notifications.at(-1)).toMatchObject({ type: 'success', message: 'Chronicle saved' });
    expect(result.current.loading).toBe(false);
    expect(result.current.actionState.type).toBeNull();
  });

  it('loadFromSlot делегира към SaveLoadService и добавя success нотификация', async () => {
    const { result } = renderHook(() => useSaveLoad());
    await waitFor(() => expect(mockService.getSaveSlots).toHaveBeenCalled());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.loadFromSlot('slot-2');
    });

    expect(mockService.loadGame).toHaveBeenCalledWith('slot-2');
    const notifications = useUIStore.getState().notifications;
    expect(notifications.at(-1)).toMatchObject({ type: 'success', message: 'Chronicle loaded' });
    expect(result.current.loading).toBe(false);
    expect(result.current.actionState.type).toBeNull();
  });

  it('loadFromSlot пропагира грешки и уведомява потребителя', async () => {
    mockService.loadGame.mockRejectedValueOnce(new Error('Missing payload'));

    const { result } = renderHook(() => useSaveLoad());
    await waitFor(() => expect(mockService.getSaveSlots).toHaveBeenCalled());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await expect(result.current.loadFromSlot('slot-2')).rejects.toThrow('Missing payload');
    });

    expect(result.current.error).toBe('Missing payload');
    const notifications = useUIStore.getState().notifications;
    expect(notifications.at(-1)).toMatchObject({ type: 'error', message: 'Missing payload' });
    expect(result.current.loading).toBe(false);
    expect(result.current.actionState.type).toBeNull();
  });

  it('пропагира грешки и показва error notification при saveToSlot', async () => {
    mockService.saveGame.mockRejectedValueOnce(new Error('Disk full'));

    const { result } = renderHook(() => useSaveLoad());
    await waitFor(() => expect(mockService.getSaveSlots).toHaveBeenCalled());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await expect(result.current.saveToSlot('slot-1')).rejects.toThrow('Disk full');
    });

    expect(result.current.error).toBe('Disk full');
    const notifications = useUIStore.getState().notifications;
    expect(notifications.at(-1)).toMatchObject({ type: 'error', message: 'Disk full' });
    expect(result.current.loading).toBe(false);
    expect(result.current.actionState.type).toBeNull();
  });

  it('recoverSlot изчиства corrupted флага и логва success нотификация', async () => {
    act(() => {
      useSaveSlots.getState().setSlot('slot-3', { corrupted: true });
    });

    const { result } = renderHook(() => useSaveLoad());
    await waitFor(() => expect(mockService.getSaveSlots).toHaveBeenCalled());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.recoverSlot('slot-3');
    });

    const slot = useSaveSlots.getState().slots.find((entry) => entry.id === 'slot-3');
    expect(slot?.corrupted).toBe(false);
    const notifications = useUIStore.getState().notifications;
    expect(notifications.at(-1)).toMatchObject({ type: 'success', message: 'Slot recovered' });
  });

  it('deleteSlot делегира към SaveLoadService и добавя success нотификация', async () => {
    const { result } = renderHook(() => useSaveLoad());
    await waitFor(() => expect(mockService.getSaveSlots).toHaveBeenCalled());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.deleteSlot('slot-3');
    });

    expect(mockService.deleteSave).toHaveBeenCalledWith('slot-3');
    const notifications = useUIStore.getState().notifications;
    expect(notifications.at(-1)).toMatchObject({ type: 'success', message: 'Save deleted' });
    expect(result.current.loading).toBe(false);
    expect(result.current.actionState.type).toBeNull();
  });

  it('deleteSlot пропагира грешки при failure', async () => {
    mockService.deleteSave.mockRejectedValueOnce(new Error('Permission denied'));

    const { result } = renderHook(() => useSaveLoad());
    await waitFor(() => expect(mockService.getSaveSlots).toHaveBeenCalled());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await expect(result.current.deleteSlot('slot-3')).rejects.toThrow('Permission denied');
    });

    expect(result.current.error).toBe('Permission denied');
    const notifications = useUIStore.getState().notifications;
    expect(notifications.at(-1)).toMatchObject({ type: 'error', message: 'Permission denied' });
    expect(result.current.loading).toBe(false);
    expect(result.current.actionState.type).toBeNull();
  });
});
