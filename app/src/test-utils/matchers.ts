import { expect } from '@jest/globals';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeWithinRange(min: number, max: number): R;
    }
  }
}

expect.extend({
  toBeWithinRange(received: number, min: number, max: number) {
    const pass = received >= min && received <= max;
    if (pass) {
      return {
        pass: true,
        message: () => `expected ${received} not to be within range ${min}-${max}`,
      };
    }
    return {
      pass: false,
      message: () => `expected ${received} to be within range ${min}-${max}`,
    };
  },
});
