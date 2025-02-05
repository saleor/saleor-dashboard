import useNavigator from "@dashboard/hooks/useNavigator";
import { renderHook } from "@testing-library/react-hooks";

import { useRowAnchorHandler } from "./useRowAnchorHandler";

jest.mock("@dashboard/hooks/useNavigator", () => jest.fn());

jest.mock("@dashboard/hooks/useNavigator", () => ({
  __esModule: true,
  default: jest.fn(() => jest.fn()),
}));

describe("useRowAnchorHandler", () => {
  it("should navigate to the given path", () => {
    // Arrange
    const navigate = jest.fn();

    (useNavigator as jest.Mock).mockReturnValue(navigate);

    const navigatorOpts = { replace: true };
    const handler = renderHook(() => useRowAnchorHandler(navigatorOpts)).result.current;
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

    (useNavigator as jest.Mock).mockReturnValue(navigate);

    const handler = renderHook(() => useRowAnchorHandler()).result.current;
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

    (useNavigator as jest.Mock).mockReturnValue(navigate);

    const handler = renderHook(() => useRowAnchorHandler()).result.current;
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
