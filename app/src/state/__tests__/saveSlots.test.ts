import { act } from '@testing-library/react-native';
import { useSaveSlots } from '../saveSlots';

describe('useSaveSlots store', () => {
  const getSlot = (id: string) => useSaveSlots.getState().slots.find((slot) => slot.id === id);

  beforeEach(() => {
    act(() => {
      useSaveSlots.getState().reset();
    });
  });

  it('setSlot слива данни и обновява hasOccupied', () => {
    act(() => {
      useSaveSlots.getState().setSlot('slot-3', {
        title: 'Occult Rescue',
        updatedAt: '2026-01-29T10:00:00.000Z',
        playtimeMinutes: 15,
        occupied: true,
        dlcFlags: ['occult'],
      });
    });

    const slot = getSlot('slot-3');
    expect(slot).toMatchObject({
      id: 'slot-3',
      title: 'Occult Rescue',
      updatedAt: '2026-01-29T10:00:00.000Z',
      playtimeMinutes: 15,
      dlcFlags: ['occult'],
      occupied: true,
    });
    expect(useSaveSlots.getState().hasOccupied).toBe(true);
  });

  it('deleteSlot занулява слот и превключва hasOccupied според остатъка', () => {
    act(() => {
      useSaveSlots.getState().deleteSlot('slot-1');
      useSaveSlots.getState().deleteSlot('slot-2');
    });

    expect(getSlot('slot-1')).toMatchObject({
      occupied: false,
      title: null,
      playtimeMinutes: 0,
      dlcFlags: [],
      corrupted: false,
    });
    expect(getSlot('slot-2')).toMatchObject({ occupied: false, title: null });
    expect(useSaveSlots.getState().hasOccupied).toBe(false);
  });

  it('reset приема custom масив и създава нови обекти', () => {
    const custom = [
      {
        id: 'alpha',
        occupied: true,
        title: 'Alpha',
        updatedAt: null,
        playtimeMinutes: 5,
        lastSaveType: 'manual' as const,
        dlcFlags: [],
        corrupted: false,
      },
    ];

    act(() => {
      useSaveSlots.getState().reset(custom);
    });

    const slot = getSlot('alpha');
    expect(slot).toMatchObject({ title: 'Alpha', occupied: true });
    expect(slot).not.toBe(custom[0]);
    expect(useSaveSlots.getState().hasOccupied).toBe(true);
  });
});
