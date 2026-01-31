import { act } from '@testing-library/react-native';
import { useUXPerfEvents } from '@/store/perfStore';

describe('perfStore', () => {
  beforeEach(() => {
    act(() => {
      useUXPerfEvents.getState().reset();
    });
  });

  it('logEvent задържа само последните 50 записа', () => {
    act(() => {
      for (let i = 0; i < 55; i += 1) {
        useUXPerfEvents.getState().logEvent({
          id: `evt-${i}`,
          durationMs: i,
          timestamp: i,
        });
      }
    });

    const events = useUXPerfEvents.getState().events;
    expect(events).toHaveLength(50);
    expect(events[0].id).toBe('evt-5');
    expect(events[events.length - 1].id).toBe('evt-54');
  });

  it('reset изчиства всички събития', () => {
    act(() => {
      useUXPerfEvents.getState().logEvent({ id: 'evt', durationMs: 10, timestamp: 1 });
      useUXPerfEvents.getState().reset();
    });

    expect(useUXPerfEvents.getState().events).toHaveLength(0);
  });

  it('logEvent добавя нов запис без да мутa стари препратки', () => {
    const firstReference = useUXPerfEvents.getState().events;

    act(() => {
      useUXPerfEvents.getState().logEvent({ id: 'evt', durationMs: 5, timestamp: Date.now() });
    });

    const nextReference = useUXPerfEvents.getState().events;
    expect(nextReference).not.toBe(firstReference);
    expect(nextReference).toHaveLength(1);
    expect(nextReference[0]).toMatchObject({ id: 'evt', durationMs: 5 });
  });
});
