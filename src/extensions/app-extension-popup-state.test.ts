import { AppExtensionTargetEnum } from "@dashboard/graphql";
import { AllFormPayloads, DashboardEventFactory } from "@saleor/app-sdk/app-bridge";
import { act, renderHook } from "@testing-library/react-hooks";

import { useAppExtensionPopup } from "./app-extension-popup-state";
import { usePopupFrameReference } from "./popup-frame-reference";
import { postToExtension } from "./views/ViewManifestExtension/components/AppFrame/usePostToExtension";

jest.mock("./popup-frame-reference");
jest.mock("./views/ViewManifestExtension/components/AppFrame/usePostToExtension");

const mockUsePopupFrameReference = usePopupFrameReference as jest.MockedFunction<
  typeof usePopupFrameReference
>;
const mockPostToExtension = postToExtension as jest.MockedFunction<typeof postToExtension>;

describe("useAppExtensionPopup", () => {
  const mockIframe = document.createElement("iframe");
  const mockActiveParams = {
    id: "test-extension-id",
    appToken: "test-token",
    src: "https://example.com/extension",
    label: "Test Extension",
    target: AppExtensionTargetEnum.POPUP,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePopupFrameReference.mockReturnValue({
      iframes: new Map(),
      setIframe: jest.fn(),
      clearIframe: jest.fn(),
    });
  });

  // Arrange
  it("should initialize with inactive state", () => {
    // Act
    const { result } = renderHook(() => useAppExtensionPopup());

    // Assert
    expect(result.current.state.active).toBe(false);
  });

  // Arrange
  it("should set active state with provided params", () => {
    const { result, unmount } = renderHook(() => useAppExtensionPopup());

    // Act
    act(() => {
      result.current.setActive(mockActiveParams);
    });

    // Assert
    expect(result.current.state.active).toBe(true);

    if (result.current.state.active) {
      expect(result.current.state.id).toBe(mockActiveParams.id);
      expect(result.current.state.appToken).toBe(mockActiveParams.appToken);
      expect(result.current.state.src).toBe(mockActiveParams.src);
      expect(result.current.state.label).toBe(mockActiveParams.label);
      expect(result.current.state.target).toBe(mockActiveParams.target);
    }

    // Cleanup
    act(() => {
      result.current.setInactive();
    });
    unmount();
  });

  // Arrange
  it("should set inactive state", () => {
    const { result } = renderHook(() => useAppExtensionPopup());

    act(() => {
      result.current.setActive(mockActiveParams);
    });

    // Act
    act(() => {
      result.current.setInactive();
    });

    // Assert
    expect(result.current.state.active).toBe(false);
  });

  // Arrange
  it("should attach form state to active extension", () => {
    const mockFormState = {
      domain: "saleor.cloud.example",
      payload: {
        data: { name: "Test Product" },
      },
    } as unknown as AllFormPayloads;
    const { result, unmount } = renderHook(() => useAppExtensionPopup());

    act(() => {
      result.current.setActive(mockActiveParams);
    });

    // Act
    act(() => {
      result.current.attachFormState(mockFormState);
    });

    // Assert
    expect(result.current.state.active).toBe(true);

    if (result.current.state.active) {
      expect(result.current.state.formState).toEqual(mockFormState);
      expect(result.current.state.id).toBe(mockActiveParams.id);
    }

    // Cleanup
    act(() => {
      result.current.setInactive();
    });
    unmount();
  });

  // Arrange
  it("should throw error when attaching form state to inactive extension", () => {
    const mockFormState = {
      domain: "saleor.cloud.example",
      payload: {
        data: { name: "Test Product" },
      },
    } as unknown as AllFormPayloads;
    const { result } = renderHook(() => useAppExtensionPopup());

    // Act & Assert
    expect(() => {
      result.current.attachFormState(mockFormState);
    }).toThrow("You cannot attach form state for closed extension");
  });

  // Arrange
  it("should post to loaded iframes when state becomes active with form state", () => {
    const mockFormState = {
      domain: "saleor.cloud.example",
      payload: {
        data: { name: "Test Product" },
      },
    } as unknown as AllFormPayloads;
    const mockIframesMap = new Map([[mockIframe, { loaded: true }]]);

    mockUsePopupFrameReference.mockReturnValue({
      iframes: mockIframesMap,
      setIframe: jest.fn(),
      clearIframe: jest.fn(),
    });

    const { result, unmount } = renderHook(() => useAppExtensionPopup());

    // Act
    act(() => {
      result.current.setActive({
        ...mockActiveParams,
        formState: mockFormState,
      });
    });

    // Assert
    expect(mockPostToExtension).toHaveBeenCalledWith(
      DashboardEventFactory.createFormEvent(mockFormState),
      mockIframe,
      "https://example.com",
    );

    // Cleanup
    act(() => {
      result.current.setInactive();
    });
    unmount();
  });

  // Arrange
  it("should not post to iframes that are not loaded", () => {
    const mockFormState = {
      domain: "saleor.cloud.example",
      payload: {
        data: { name: "Test Product" },
      },
    } as unknown as AllFormPayloads;
    const mockIframesMap = new Map([[mockIframe, { loaded: false }]]);

    mockUsePopupFrameReference.mockReturnValue({
      iframes: mockIframesMap,
      setIframe: jest.fn(),
      clearIframe: jest.fn(),
    });

    const { result, unmount } = renderHook(() => useAppExtensionPopup());

    // Act
    act(() => {
      result.current.setActive({
        ...mockActiveParams,
        formState: mockFormState,
      });
    });

    // Assert
    expect(mockPostToExtension).not.toHaveBeenCalled();

    // Cleanup
    act(() => {
      result.current.setInactive();
    });
    unmount();
  });

  // Arrange
  it("should not post to iframes when state is inactive", () => {
    const mockIframesMap = new Map([[mockIframe, { loaded: true }]]);

    mockUsePopupFrameReference.mockReturnValue({
      iframes: mockIframesMap,
      setIframe: jest.fn(),
      clearIframe: jest.fn(),
    });

    // Act
    renderHook(() => useAppExtensionPopup());

    // Assert
    expect(mockPostToExtension).not.toHaveBeenCalled();
  });

  // Arrange
  it("should preserve all params when attaching form state", () => {
    const initialParams = {
      ...mockActiveParams,
      params: { productId: "test-product-id" },
    };
    const mockFormState = {
      domain: "saleor.cloud.example",
      payload: {
        data: { name: "Test Product" },
      },
    } as unknown as AllFormPayloads;

    const { result, unmount } = renderHook(() => useAppExtensionPopup());

    act(() => {
      result.current.setActive(initialParams);
    });

    // Act
    act(() => {
      result.current.attachFormState(mockFormState);
    });

    // Assert
    expect(result.current.state.active).toBe(true);

    if (result.current.state.active) {
      expect(result.current.state.id).toBe(initialParams.id);
      expect(result.current.state.appToken).toBe(initialParams.appToken);
      expect(result.current.state.src).toBe(initialParams.src);
      expect(result.current.state.label).toBe(initialParams.label);
      expect(result.current.state.target).toBe(initialParams.target);
      expect(result.current.state.params).toEqual(initialParams.params);
      expect(result.current.state.formState).toEqual(mockFormState);
    }

    // Cleanup
    act(() => {
      result.current.setInactive();
    });
    unmount();
  });

  // Arrange
  it("should handle multiple iframes when posting to extension", () => {
    const anotherMockIframe = document.createElement("iframe");
    const mockFormState = {
      domain: "saleor.cloud.example",
      payload: {
        data: { name: "Test Product" },
      },
    } as unknown as AllFormPayloads;
    const mockIframesMap = new Map([
      [mockIframe, { loaded: true }],
      [anotherMockIframe, { loaded: true }],
    ]);

    mockUsePopupFrameReference.mockReturnValue({
      iframes: mockIframesMap,
      setIframe: jest.fn(),
      clearIframe: jest.fn(),
    });

    const { result, unmount } = renderHook(() => useAppExtensionPopup());

    // Act
    act(() => {
      result.current.setActive({
        ...mockActiveParams,
        formState: mockFormState,
      });
    });

    // Assert
    expect(mockPostToExtension).toHaveBeenCalledTimes(2);
    expect(mockPostToExtension).toHaveBeenCalledWith(
      DashboardEventFactory.createFormEvent(mockFormState),
      mockIframe,
      "https://example.com",
    );
    expect(mockPostToExtension).toHaveBeenCalledWith(
      DashboardEventFactory.createFormEvent(mockFormState),
      anotherMockIframe,
      "https://example.com",
    );

    // Cleanup
    act(() => {
      result.current.setInactive();
    });
    unmount();
  });
});
