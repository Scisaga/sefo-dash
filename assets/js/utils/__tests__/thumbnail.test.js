const generateWorkflowStyleBase64 = require('../thumbnail');

describe('generateWorkflowStyleBase64', () => {
  beforeEach(() => {
    const ctx = {
      fillRect: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      stroke: jest.fn(),
      arc: jest.fn(),
      rect: jest.fn(),
      fill: jest.fn()
    };
    const canvas = {
      width: 0,
      height: 0,
      getContext: jest.fn(() => ctx),
      toDataURL: jest.fn(() => 'data:image/png;base64,MOCK_DATA')
    };
    global.document = { createElement: jest.fn(() => canvas) };
    // store for assertion
    this.canvas = canvas;
  });

  test('returns base64 image string', () => {
    const result = generateWorkflowStyleBase64();
    expect(result).toMatch(/^data:image\/png;base64,.+/);
    expect(result.length).toBeGreaterThan('data:image/png;base64,'.length);
  });
});
