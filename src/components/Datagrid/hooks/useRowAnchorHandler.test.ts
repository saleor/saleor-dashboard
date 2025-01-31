import { renderHook } from "@testing-library/react-hooks";

import { useRowAnchorHandler } from "./useRowAnchorHandler";

describe("useRowAnchorHandler", () => {
  it("should navigate to the given path", () => {
    // Arrange
    const navigate = jest.fn();
    const navigatorOpts = { replace: true };
    const handler = renderHook(() => useRowAnchorHandler(navigate, navigatorOpts)).result.current;
    const event = {
      preventDefault: jest.fn(),
      currentTarget: {
        dataset: {
          reactRouterPath: "/some-path",
        },
      },
    };

    // Act
    handler(event as any);

    // Assert
    expect(event.preventDefault).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith("/some-path", navigatorOpts);
  });

  it("should not prevent default when CMD key is pressed", () => {
    // Arrange
    const navigate = jest.fn();
    const handler = renderHook(() => useRowAnchorHandler(navigate)).result.current;
    const event = {
      preventDefault: jest.fn(),
      metaKey: true,
      ctrlKey: false,
    };

    // Act
    handler(event as any);

    // Assert
    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });

  it("should not prevent default when CTRL key is pressed", () => {
    // Arrange
    const navigate = jest.fn();
    const handler = renderHook(() => useRowAnchorHandler(navigate)).result.current;
    const event = {
      preventDefault: jest.fn(),
      metaKey: false,
      ctrlKey: true,
    };

    // Act
    handler(event as any);

    // Assert
    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });
});
