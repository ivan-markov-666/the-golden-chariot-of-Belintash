import { buildSaveSlot } from '../saveSlotFactory';

describe('buildSaveSlot', () => {
  it('creates unique slots by default', () => {
    const slotA = buildSaveSlot();
    const slotB = buildSaveSlot();

    expect(slotA.id).not.toBe(slotB.id);
    expect(slotA.title).not.toBe(slotB.title);
    expect(slotA.occupied).toBe(true);
  });

  it('accepts overrides for any field', () => {
    const custom = buildSaveSlot({ id: 'custom', occupied: false, title: 'Story' });

    expect(custom.id).toBe('custom');
    expect(custom.occupied).toBe(false);
    expect(custom.title).toBe('Story');
  });
});
