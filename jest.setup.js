global.performance = {
  now: jest.fn(),
  // Add other performance methods you need to mock
};
global.setImmediate = global.setTimeout;
