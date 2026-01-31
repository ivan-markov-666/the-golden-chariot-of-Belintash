import { act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useCharacterStore,
  selectAttribute,
  selectCharacter,
  selectEffectiveAttributes,
  selectEffectiveSkills,
  selectHealth,
  selectInventoryStatus,
  selectMana,
  selectPendingAttributePoints,
  selectPendingSkillPoints,
  selectSkill,
  selectStatusEffects,
} from '@/store/characterStore';

describe('characterStore', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    act(() => {
      useCharacterStore.getState().resetCharacter();
    });
  });

  it('createCharacter creates baseline character and selectors work', () => {
    act(() => {
      useCharacterStore.getState().createCharacter({ name: 'Belintash', gold: 10 });
    });

    const state = useCharacterStore.getState();
    expect(selectCharacter(state)?.name).toBe('Belintash');
    expect(selectCharacter(state)?.gold).toBe(10);
    expect(selectHealth(state)).toEqual({ current: 10, max: 10 });
    expect(selectMana(state)).toEqual({ current: 5, max: 5 });
    expect(selectAttribute('strength')(state)).toBeGreaterThan(0);
    expect(selectSkill('alchemy')(state)).toBe(0);
  });

  it('updateCharacter is a no-op when character is null', () => {
    act(() => {
      useCharacterStore.getState().updateCharacter({ name: 'ShouldNotAppear' });
    });

    expect(useCharacterStore.getState().character).toBeNull();
  });

  it('levelUp requires enough experience and applies rewards', () => {
    act(() => {
      useCharacterStore.getState().createCharacter({ level: 1, experience: 0 });
      useCharacterStore.getState().addExperience(50);
      useCharacterStore.getState().levelUp();
    });

    expect(useCharacterStore.getState().character?.level).toBe(1);

    act(() => {
      useCharacterStore.getState().addExperience(100);
      useCharacterStore.getState().levelUp();
    });

    const character = useCharacterStore.getState().character;
    expect(character?.level).toBe(2);
    expect(character?.experience).toBeGreaterThanOrEqual(0);
    expect(character?.maxHealth).toBe(15);
    expect(character?.health).toBe(15);
    expect(character?.maxMana).toBe(8);
    expect(character?.mana).toBe(8);
  });

  it('adjustHealth/adjustMana clamp to 0..max and adjustGold clamps to >=0', () => {
    act(() => {
      useCharacterStore.getState().createCharacter({ health: 5, maxHealth: 10, mana: 2, maxMana: 5, gold: 3 });
      useCharacterStore.getState().adjustHealth(-999);
      useCharacterStore.getState().adjustMana(999);
      useCharacterStore.getState().adjustGold(-999);
    });

    const character = useCharacterStore.getState().character;
    expect(character?.health).toBe(0);
    expect(character?.mana).toBe(5);
    expect(character?.gold).toBe(0);
  });

  it('increaseAttribute/increaseSkill clamp to 0..100 and handle missing skills', () => {
    act(() => {
      useCharacterStore.getState().createCharacter();
      useCharacterStore.getState().increaseAttribute('strength', 999);
      useCharacterStore.getState().increaseSkill('occult', 5);
      useCharacterStore.getState().increaseSkill('occult', 999);
    });

    const character = useCharacterStore.getState().character;
    expect(character?.attributes.strength).toBe(100);
    expect(character?.skills.occult).toBe(100);
  });

  it('addItem/removeItem cover existing/new branches and remove when quantity hits 0', () => {
    act(() => {
      useCharacterStore.getState().createCharacter({ inventory: [] });
      useCharacterStore.getState().addItem('amulet');
      useCharacterStore.getState().addItem('amulet', 2);
      useCharacterStore.getState().addItem('ring', 1);
      useCharacterStore.getState().removeItem('amulet', 10);
    });

    const inventory = useCharacterStore.getState().character?.inventory ?? [];
    expect(inventory.find((item) => item.id === 'amulet')).toBeUndefined();
    expect(inventory.find((item) => item.id === 'ring')?.quantity).toBe(1);
  });

  it('equipItem/unequipItem modify equipment slots', () => {
    act(() => {
      useCharacterStore.getState().createCharacter({
        inventory: [{ id: 'sabre', quantity: 1 }],
      });
      useCharacterStore.getState().equipItem('weapon', 'sabre');
    });

    expect(useCharacterStore.getState().character?.equipment.weapon).toMatchObject({ id: 'sabre' });

    act(() => {
      useCharacterStore.getState().unequipItem('weapon');
    });

    expect(useCharacterStore.getState().character?.equipment.weapon).toBeUndefined();
  });

  it('spendAttributePoint/spendSkillPoint consume pending points', () => {
    act(() => {
      useCharacterStore.getState().createCharacter({ attributePoints: 1, skillPoints: 1 });
      useCharacterStore.getState().spendAttributePoint('strength');
      useCharacterStore.getState().spendSkillPoint('alchemy');
    });

    const state = useCharacterStore.getState();
    expect(selectPendingAttributePoints(state)).toBe(0);
    expect(selectPendingSkillPoints(state)).toBe(0);
    expect(selectAttribute('strength')(state)).toBeGreaterThan(10);
    expect(selectSkill('alchemy')(state)).toBe(1);
  });

  it('tracks inventory weight and encumbrance when adding/removing items', () => {
    act(() => {
      useCharacterStore.getState().createCharacter({ maxCarryWeight: 2 });
      useCharacterStore.getState().addItem('ore', 5);
    });

    const status = selectInventoryStatus(useCharacterStore.getState());
    expect(status?.weight).toBeGreaterThan(0);
    expect(status?.encumbered).toBe(true);
  });

  it('apply/remove status effects updates selectors and effective stats', () => {
    const effectId = 'buff-1';
    act(() => {
      useCharacterStore.getState().createCharacter();
      useCharacterStore.getState().applyStatusEffect({
        id: effectId,
        type: 'buff',
        appliedAt: Date.now(),
        attributeModifiers: { strength: 5 },
        skillModifiers: { occult: 3 },
      });
    });

    let state = useCharacterStore.getState();
    expect(selectStatusEffects(state)).toHaveLength(1);
    expect(selectEffectiveAttributes(state)?.strength).toBeGreaterThan(10);
    expect(selectEffectiveSkills(state)?.occult).toBe(3);

    act(() => {
      useCharacterStore.getState().removeStatusEffect(effectId);
    });

    state = useCharacterStore.getState();
    expect(selectStatusEffects(state)).toHaveLength(0);
  });
});
