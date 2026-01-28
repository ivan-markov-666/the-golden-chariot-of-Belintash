import { act } from '@testing-library/react-native';
import { useUXPerfEvents } from '../perf';

describe('useUXPerfEvents store', () => {
  beforeEach(() => {
    act(() => {
      useUXPerfEvents.getState().reset();
    });
  });

  it('stores the latest 50 events', () => {
    act(() => {
      for (let i = 0; i < 55; i += 1) {
        useUXPerfEvents.getState().logEvent({ id: `evt-${i}`, durationMs: i, timestamp: i });
      }
    });

    const events = useUXPerfEvents.getState().events;
    expect(events).toHaveLength(50);
    expect(events[0].id).toBe('evt-5');
    expect(events[49].id).toBe('evt-54');
  });
});
