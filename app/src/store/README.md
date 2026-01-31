# Store Architecture

## Overview

The engine state is split into four dedicated Zustand stores:

| Store | Persistence | Responsibility |
| --- | --- | --- |
| `useGameStore` | ✅ AsyncStorage (`game-storage`) | Flags, counters, location, relationships, time, metadata |
| `useCharacterStore` | ✅ AsyncStorage (`character-storage`) | Player stats/skills/resources/inventory/equipment |
| `useQuestStore` | ✅ AsyncStorage (`quest-storage`) | Quest lifecycle + objectives |
| `useUIStore` | ❌ non-persisted | Loading state, modals, notifications |

All stores share the same structure: `devtools` middleware for Redux DevTools naming/inspection and `persist` middleware (where enabled) with `createJSONStorage` targeting React Native AsyncStorage.

## Usage

```tsx
import { useGameStore, selectFlag } from '@/store/gameStore';
import { useCharacterStore, selectHealth } from '@/store/characterStore';

export function QuestGate() {
  const hasKey = useGameStore(selectFlag('obelisk_key'));
  const health = useCharacterStore(selectHealth);
  const setFlag = useGameStore((state) => state.setFlag);

  const handleUnlock = () => {
    if (hasKey) {
      setFlag('obelisk_opened', true);
    }
  };

  return (
    <View>
      <Text>HP: {health?.current}/{health?.max}</Text>
      <Button title="Unlock" onPress={handleUnlock} />
    </View>
  );
}
```

### Outside React components

```ts
import { useQuestStore } from '@/store/questStore';

const questState = useQuestStore.getState();
questState.startQuest('bears_of_belintash', [
  { id: 'find_cave', completed: false },
]);
```

## Testing pattern

```ts
import { useUIStore } from '@/store/uiStore';

afterEach(() => {
  useUIStore.setState((state) => ({ ...state, notifications: [] }));
});

it('adds notifications', () => {
  useUIStore.getState().addNotification({ type: 'info', message: 'Saved!' });
  expect(useUIStore.getState().notifications).toHaveLength(1);
});
```

## DevTools naming

Each action is given a descriptive name (e.g. `game/setFlag/foo`, `character/equip/head`). This makes debugging in Redux DevTools straightforward.
