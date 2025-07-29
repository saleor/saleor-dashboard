import useNavigator from "@dashboard/hooks/useNavigator";
import { globalSearchUrl } from "@dashboard/search/urls";
import { renderHook } from "@testing-library/react-hooks";
import { useHotkeys } from "react-hotkeys-hook";

import { useActionItems } from "./useActionItems";
import { useCommandMenuInput } from "./useCommandMenuInput";
import { useKeyboardNavigation } from "./useKeyboardNavigation";
import { useNavigatorSearchContext } from "./useNavigatorSearchContext";

jest.mock("@dashboard/hooks/useNavigator");
jest.mock("@dashboard/search/urls");
jest.mock("react-hotkeys-hook");
jest.mock("./useActionItems");
jest.mock("./useCommandMenuInput");
jest.mock("./useNavigatorSearchContext");

describe("useKeyboardNavigation", () => {
  const mockNavigate = jest.fn();
  const mockSetNavigatorVisibility = jest.fn();
  const mockUpdateAriaActiveDescendant = jest.fn();
  const mockClearActiveDescendant = jest.fn();
  const mockResetInput = jest.fn();
  const mockResetFocus = jest.fn();
  const mockCollectLinks = jest.fn();
  const mockCollectTableRows = jest.fn();
  const mockFocusFirst = jest.fn();
  const mockFocusNext = jest.fn();
  const mockFocusPrevious = jest.fn();
  const mockGetActiveFocusedElement = jest.fn();
  const mockTakeAction = jest.fn();
  const mockUseHotkeys = jest.fn();

  const defaultMockElement = {
    id: "test-element-id",
    getAttribute: jest.fn(),
    setAttribute: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useNavigator as jest.Mock).mockReturnValue(mockNavigate);
    (globalSearchUrl as jest.Mock).mockReturnValue("/search?q=test");
    (useHotkeys as jest.Mock).mockImplementation(mockUseHotkeys);

    (useNavigatorSearchContext as jest.Mock).mockReturnValue({
      isNavigatorVisible: true,
      setNavigatorVisibility: mockSetNavigatorVisibility,
    });

    (useCommandMenuInput as jest.Mock).mockReturnValue({
      updateAriaActiveDescendant: mockUpdateAriaActiveDescendant,
      clearActiveDescendant: mockClearActiveDescendant,
      resetInput: mockResetInput,
    });

    (useActionItems as jest.Mock).mockReturnValue({
      resetFocus: mockResetFocus,
      collectLinks: mockCollectLinks,
      collectTableRows: mockCollectTableRows,
      focusFirst: mockFocusFirst,
      focusNext: mockFocusNext,
      focusPrevious: mockFocusPrevious,
      getActiveFocusedElement: mockGetActiveFocusedElement,
      takeAction: mockTakeAction,
    });

    mockGetActiveFocusedElement.mockReturnValue(defaultMockElement);
  });

  describe("initialization", () => {
    it("should return correct interface", () => {
      const { result } = renderHook(() => useKeyboardNavigation({ query: "test" }));

      expect(result.current).toMatchObject({
        scope: expect.objectContaining({ current: null }),
        resetFocus: mockResetFocus,
        collectLinks: mockCollectLinks,
        collectTableRows: mockCollectTableRows,
      });
    });

    it("should register hotkeys with correct settings", () => {
      renderHook(() => useKeyboardNavigation({ query: "test" }));

      const expectedHotkeysSettings = {
        enableOnFormTags: true,
        scopes: ["command-menu"],
      };

      expect(useHotkeys).toHaveBeenCalledWith("tab", expect.any(Function), expectedHotkeysSettings);
      expect(useHotkeys).toHaveBeenCalledWith("up", expect.any(Function), expectedHotkeysSettings);
      expect(useHotkeys).toHaveBeenCalledWith(
        "down",
        expect.any(Function),
        expectedHotkeysSettings,
      );
      expect(useHotkeys).toHaveBeenCalledWith(
        "ctrl+enter, meta+enter",
        expect.any(Function),
        expectedHotkeysSettings,
      );
      expect(useHotkeys).toHaveBeenCalledWith(
        "enter",
        expect.any(Function),
        expectedHotkeysSettings,
      );
    });
  });

  describe("query change effect", () => {
    it("should focus first element and update aria active descendant when query changes", () => {
      const { rerender } = renderHook(({ query }) => useKeyboardNavigation({ query }), {
        initialProps: { query: "initial" },
      });

      expect(mockFocusFirst).toHaveBeenCalledTimes(1);
      expect(mockGetActiveFocusedElement).toHaveBeenCalledTimes(1);
      expect(mockUpdateAriaActiveDescendant).toHaveBeenCalledWith("test-element-id");

      rerender({ query: "new query" });

      expect(mockFocusFirst).toHaveBeenCalledTimes(2);
      expect(mockGetActiveFocusedElement).toHaveBeenCalledTimes(2);
      expect(mockUpdateAriaActiveDescendant).toHaveBeenCalledWith("test-element-id");
    });

    it("should clear aria active descendant when no active focused element", () => {
      mockGetActiveFocusedElement.mockReturnValue(undefined);

      renderHook(() => useKeyboardNavigation({ query: "test" }));

      expect(mockFocusFirst).toHaveBeenCalled();
      expect(mockGetActiveFocusedElement).toHaveBeenCalled();
      expect(mockUpdateAriaActiveDescendant).not.toHaveBeenCalled();
      expect(mockClearActiveDescendant).toHaveBeenCalled();
    });
  });

  describe("visibility change effect", () => {
    it("should reset focus when navigator becomes invisible", () => {
      const { rerender } = renderHook(() => useKeyboardNavigation({ query: "test" }));

      (useNavigatorSearchContext as jest.Mock).mockReturnValue({
        isNavigatorVisible: false,
        setNavigatorVisibility: mockSetNavigatorVisibility,
      });

      rerender();

      expect(mockResetFocus).toHaveBeenCalled();
    });

    it("should not reset focus when navigator is visible", () => {
      renderHook(() => useKeyboardNavigation({ query: "test" }));

      expect(mockResetFocus).not.toHaveBeenCalled();
    });
  });

  describe("hotkey handlers", () => {
    let hotkeyHandlers: Record<string, (event: KeyboardEvent) => boolean>;

    beforeEach(() => {
      hotkeyHandlers = {};
      (useHotkeys as jest.Mock).mockImplementation((keys, handler) => {
        hotkeyHandlers[keys] = handler;
      });

      renderHook(() => useKeyboardNavigation({ query: "test" }));
    });

    describe("tab key", () => {
      it("should prevent default and focus next element", () => {
        const mockEvent = { preventDefault: jest.fn() } as any;

        const result = hotkeyHandlers["tab"](mockEvent);

        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(mockFocusNext).toHaveBeenCalled();
        expect(result).toBe(false);
      });
    });

    describe("up key", () => {
      it("should prevent default and focus previous element", () => {
        const mockEvent = { preventDefault: jest.fn() } as any;

        const result = hotkeyHandlers["up"](mockEvent);

        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(mockFocusPrevious).toHaveBeenCalled();
        expect(result).toBe(false);
      });
    });

    describe("down key", () => {
      it("should prevent default and focus next element", () => {
        const mockEvent = { preventDefault: jest.fn() } as any;

        const result = hotkeyHandlers["down"](mockEvent);

        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(mockFocusNext).toHaveBeenCalled();
        expect(result).toBe(false);
      });
    });

    describe("ctrl+enter and meta+enter keys", () => {
      it("should prevent default, hide navigator, reset focus and navigate to global search", () => {
        const mockEvent = { preventDefault: jest.fn() } as any;
        const query = "test query";

        renderHook(() => useKeyboardNavigation({ query }));

        const result = hotkeyHandlers["ctrl+enter, meta+enter"](mockEvent);

        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(mockSetNavigatorVisibility).toHaveBeenCalledWith(false);
        expect(mockResetFocus).toHaveBeenCalled();
        expect(globalSearchUrl).toHaveBeenCalledWith({ query });
        expect(mockNavigate).toHaveBeenCalledWith("/search?q=test");
        expect(result).toBe(false);
      });
    });

    describe("enter key", () => {
      it("should prevent default, take action, reset input and hide navigator", () => {
        const mockEvent = { preventDefault: jest.fn() } as any;

        const result = hotkeyHandlers["enter"](mockEvent);

        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(mockTakeAction).toHaveBeenCalled();
        expect(mockResetInput).toHaveBeenCalled();
        expect(mockSetNavigatorVisibility).toHaveBeenCalledWith(false);
        expect(result).toBe(false);
      });
    });
  });

  describe("dependency integration", () => {
    it("should use all dependencies correctly", () => {
      renderHook(() => useKeyboardNavigation({ query: "test" }));

      expect(useNavigator).toHaveBeenCalled();
      expect(useNavigatorSearchContext).toHaveBeenCalled();
      expect(useCommandMenuInput).toHaveBeenCalled();
      expect(useActionItems).toHaveBeenCalled();
    });
  });
});
