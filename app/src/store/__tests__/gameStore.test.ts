import { act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  selectCounter,
  selectFlag,
  selectGameTime,
  selectLocation,
  selectRelationship,
  useGameStore,
} from '@/store/gameStore';
import { createInitialGameState } from '@/game/types/gameState';

describe('gameStore', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    act(() => {
      useGameStore.getState().resetGameState();
    });
  });

  it('setFlag/setCounter and selectors read defaults', () => {
    act(() => {
      useGameStore.getState().setFlag('met_witness', true);
      useGameStore.getState().setCounter('rituals', 2);
    });

    const state = useGameStore.getState();
    expect(selectFlag('met_witness')(state)).toBe(true);
    expect(selectCounter('rituals')(state)).toBe(2);
  });

  it('incrementCounter/decrementCounter handle missing keys and clamp at 0', () => {
    act(() => {
      useGameStore.getState().incrementCounter('steps');
      useGameStore.getState().incrementCounter('steps', 2);
      useGameStore.getState().decrementCounter('steps', 999);
    });

    const state = useGameStore.getState();
    expect(selectCounter('steps')(state)).toBe(0);
  });

  it('setLocation adds to unlockedLocations only once', () => {
    act(() => {
      useGameStore.getState().setLocation('kamenitsa');
      useGameStore.getState().setLocation('kamenitsa');
    });

    const state = useGameStore.getState().gameState;
    expect(selectLocation({ gameState: state } as any)).toBe('kamenitsa');
    expect(state.unlockedLocations.filter((loc) => loc === 'kamenitsa')).toHaveLength(1);
  });

  it('advanceTime rolls day/hour and sets period branches', () => {
    act(() => {
      useGameStore.getState().resetGameState();
      useGameStore.getState().setGameTime({ day: 1, hour: 5, period: 'night' });
      useGameStore.getState().advanceTime(1);
    });

    let time = selectGameTime(useGameStore.getState());
    expect(time).toMatchObject({ day: 1, hour: 6, period: 'morning' });

    act(() => {
      useGameStore.getState().setGameTime({ day: 1, hour: 11, period: 'morning' });
      useGameStore.getState().advanceTime(1);
    });

    time = selectGameTime(useGameStore.getState());
    expect(time.period).toBe('afternoon');

    act(() => {
      useGameStore.getState().setGameTime({ day: 1, hour: 17, period: 'afternoon' });
      useGameStore.getState().advanceTime(1);
    });

    time = selectGameTime(useGameStore.getState());
    expect(time.period).toBe('evening');

    act(() => {
      useGameStore.getState().setGameTime({ day: 1, hour: 21, period: 'evening' });
      useGameStore.getState().advanceTime(1);
    });

    time = selectGameTime(useGameStore.getState());
    expect(time.period).toBe('night');

    act(() => {
      useGameStore.getState().setGameTime({ day: 1, hour: 1, period: 'night' });
      useGameStore.getState().advanceTime(-2);
    });

    time = selectGameTime(useGameStore.getState());
    expect(time.hour).toBe(23);
  });

  it('advanceTime прехвърля дни напред/назад при големи стъпки', () => {
    act(() => {
      useGameStore.getState().setGameTime({ day: 3, hour: 22, period: 'night' });
      useGameStore.getState().advanceTime(30);
    });

    let time = selectGameTime(useGameStore.getState());
    expect(time).toMatchObject({ day: 5, hour: 4, period: 'night' });

    act(() => {
      useGameStore.getState().setGameTime({ day: 5, hour: 1, period: 'night' });
      useGameStore.getState().advanceTime(-27);
    });

    time = selectGameTime(useGameStore.getState());
    expect(time).toMatchObject({ day: 3, hour: 22, period: 'night' });
  });

  it('setRelationship/adjustRelationship clamp to -100..100', () => {
    act(() => {
      useGameStore.getState().setRelationship('npc_voden', 999);
      useGameStore.getState().adjustRelationship('npc_voden', -500);
      useGameStore.getState().adjustRelationship('npc_voden', -500);
    });

    const state = useGameStore.getState();
    expect(selectRelationship('npc_voden')(state)).toBe(-100);
  });

  it('setRelationship не позволява стойности над 100 и adjustRelationship ги задържа в обхвата', () => {
    act(() => {
      useGameStore.getState().setRelationship('npc_smolyan', 150);
      useGameStore.getState().adjustRelationship('npc_smolyan', 25);
    });

    const state = useGameStore.getState();
    expect(selectRelationship('npc_smolyan')(state)).toBe(100);
  });

  it('loadGameState replaces whole snapshot', () => {
    const fresh = createInitialGameState();
    const loaded = {
      ...fresh,
      location: 'kamenitsa',
      flags: { x: true },
    };

    act(() => {
      useGameStore.getState().loadGameState(loaded);
    });

    expect(useGameStore.getState().gameState.location).toBe('kamenitsa');
    expect(useGameStore.getState().gameState.flags.x).toBe(true);
  });

  it('loadGameState записва snapshot и през persist слоя', async () => {
    const fresh = createInitialGameState();
    const loaded = {
      ...fresh,
      location: 'occult-sanctum',
      flags: { ritual_complete: true },
    };

    await act(async () => {
      useGameStore.getState().loadGameState(loaded);
    });

    await new Promise((resolve) => setTimeout(resolve, 0));

    const persistedRaw = await AsyncStorage.getItem('game-storage');
    expect(persistedRaw).toBeTruthy();

    const persisted = JSON.parse(persistedRaw!);
    expect(persisted.state.gameState.location).toBe('occult-sanctum');
    expect(persisted.state.gameState.flags.ritual_complete).toBe(true);
  });
});
