export const mockResizeObserver = () => {
  // Datagrid use ResizeObserver to detect changes in canvas size
  global.ResizeObserver = jest.fn().mockImplementation(callback => ({
    observe: jest.fn(() => callback([{ contentRect: { height: 1000, width: 1000 } }])),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
};
