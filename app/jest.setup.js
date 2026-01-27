const { performance } = require('perf_hooks');
const mockAsyncStorage = require('@react-native-async-storage/async-storage/jest/async-storage-mock');

if (!global.__fbBatchedBridgeConfig) {
  global.__fbBatchedBridgeConfig = { remoteModuleConfig: [] };
}

if (!global.performance) {
  global.performance = performance;
}

jest.mock('react-native/Libraries/TurboModule/TurboModuleRegistry', () => {
  const platformConstants = {
    getConstants: () => ({
      forceTouchAvailable: false,
      interfaceIdiom: 'phone',
      osVersion: 'test',
      systemName: 'iOS',
      systemVersion: '17.0',
      isTesting: true,
    }),
  };

  const deviceInfo = {
    getConstants: () => ({
      Dimensions: {
        window: { width: 390, height: 844, scale: 3, fontScale: 1 },
        screen: { width: 390, height: 844, scale: 3, fontScale: 1 },
      },
    }),
  };

  return {
    get: () => undefined,
    getEnforcing: (name) => {
      if (name === 'PlatformConstants') {
        return platformConstants;
      }
      if (name === 'DeviceInfo') {
        return deviceInfo;
      }
      return { getConstants: () => ({}) };
    },
  };
});

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
