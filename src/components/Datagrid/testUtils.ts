export const mockResizeObserver = () => {
  // Datagrid use ResizeObserver to detect changes in canvas size
  global.ResizeObserver = jest.fn().mockImplementation(callback => ({
    observe: jest.fn(() => callback([{ contentRect: { height: 1000, width: 1000 } }])),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
};

export const prepareDatagridScroller = () => {
  // Datagrid reads clientWidth and clientHeight from the scroller element
  // and use those values to set canvas size
  const scroller = document.getElementsByClassName("dvn-scroller").item(0);

  if (scroller !== null) {
    jest.spyOn(scroller, "clientWidth", "get").mockImplementation(() => 1000);
    jest.spyOn(scroller, "clientHeight", "get").mockImplementation(() => 1000);
  }
};
