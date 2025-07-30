import { renderHook } from "@testing-library/react-hooks";

import { useActionItems } from "./useActionItems";

const mockNavigate = jest.fn();

jest.mock("@dashboard/hooks/useNavigator", () => ({
  __esModule: true,
  default: () => mockNavigate,
}));

const mockScrollIntoView = jest.fn();

Element.prototype.scrollIntoView = mockScrollIntoView;

describe("useActionItems", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockScrollIntoView.mockClear();

    document.body.innerHTML = "";
  });

  const createMockElements = (count: number, className: string) => {
    const elements: HTMLElement[] = [];

    for (let i = 0; i < count; i++) {
      const element = document.createElement("div");

      element.className = className;
      element.dataset.href = `/test-route-${i}`;
      element.setAttribute = jest.fn();
      document.body.appendChild(element);
      elements.push(element);
    }

    return elements;
  };

  describe("initial state", () => {
    it("should initialize with empty items and undefined focus", () => {
      const { result } = renderHook(() => useActionItems());

      expect(result.current.items.current).toEqual([]);
      expect(result.current.currentFocusIndex.current).toBeUndefined();
      expect(result.current.hasAnyFocus()).toBe(false);
    });
  });

  describe("collectLinks", () => {
    it("should collect elements with command-menu-item class", () => {
      const mockElements = createMockElements(3, "command-menu-item");
      const { result } = renderHook(() => useActionItems());

      result.current.collectLinks();

      expect(result.current.items.current).toHaveLength(3);
      expect(result.current.items.current).toEqual(expect.arrayContaining(mockElements));
    });

    it("should append to existing items", () => {
      createMockElements(2, "command-menu-item");

      const { result } = renderHook(() => useActionItems());

      const existingElement = document.createElement("div");

      result.current.items.current.push(existingElement);

      result.current.collectLinks();

      expect(result.current.items.current).toHaveLength(3);
      expect(result.current.items.current[0]).toBe(existingElement);
    });
  });

  describe("collectTableRows", () => {
    it("should collect table row elements with command-menu class", () => {
      const table = document.createElement("table");

      table.className = "command-menu";

      const rows: HTMLElement[] = [];

      for (let i = 0; i < 2; i++) {
        const row = document.createElement("tr");

        row.setAttribute = jest.fn();
        table.appendChild(row);
        rows.push(row);
      }

      document.body.appendChild(table);

      const { result } = renderHook(() => useActionItems());

      result.current.collectTableRows();

      expect(result.current.items.current).toHaveLength(2);
      expect(result.current.items.current).toEqual(expect.arrayContaining(rows));
    });
  });

  describe("focus management", () => {
    let mockElements: HTMLElement[];

    beforeEach(() => {
      mockElements = createMockElements(3, "command-menu-item");
    });

    describe("focusFirst", () => {
      it("should set focus to first element", () => {
        const { result } = renderHook(() => useActionItems());

        result.current.collectLinks();

        result.current.focusFirst();

        expect(result.current.currentFocusIndex.current).toBe(0);
        expect(mockElements[0].setAttribute).toHaveBeenCalledWith("data-focus", "true");
        expect(mockElements[0].setAttribute).toHaveBeenCalledWith("aria-selected", "true");
        expect(mockScrollIntoView).toHaveBeenCalled();
      });
    });

    describe("focusNext", () => {
      it("should move focus to next element", () => {
        const { result } = renderHook(() => useActionItems());

        result.current.collectLinks();
        result.current.focusFirst();

        result.current.focusNext();

        expect(result.current.currentFocusIndex.current).toBe(1);
        expect(mockElements[0].setAttribute).toHaveBeenCalledWith("data-focus", "false");
        expect(mockElements[0].setAttribute).toHaveBeenCalledWith("aria-selected", "false");
        expect(mockElements[1].setAttribute).toHaveBeenCalledWith("data-focus", "true");
        expect(mockElements[1].setAttribute).toHaveBeenCalledWith("aria-selected", "true");
      });

      it("should wrap to first element when at the end", () => {
        const { result } = renderHook(() => useActionItems());

        result.current.collectLinks();
        result.current.currentFocusIndex.current = 2;

        result.current.focusNext();

        expect(result.current.currentFocusIndex.current).toBe(0);
      });

      it("should do nothing when no focus is set", () => {
        const { result } = renderHook(() => useActionItems());

        result.current.collectLinks();

        result.current.focusNext();

        expect(result.current.currentFocusIndex.current).toBeUndefined();
      });
    });

    describe("focusPrevious", () => {
      it("should move focus to previous element", () => {
        const { result } = renderHook(() => useActionItems());

        result.current.collectLinks();
        result.current.currentFocusIndex.current = 1;

        result.current.focusPrevious();

        expect(result.current.currentFocusIndex.current).toBe(0);
        expect(mockElements[1].setAttribute).toHaveBeenCalledWith("data-focus", "false");
        expect(mockElements[1].setAttribute).toHaveBeenCalledWith("aria-selected", "false");
        expect(mockElements[0].setAttribute).toHaveBeenCalledWith("data-focus", "true");
        expect(mockElements[0].setAttribute).toHaveBeenCalledWith("aria-selected", "true");
      });

      it("should do nothing when at first element", () => {
        const { result } = renderHook(() => useActionItems());

        result.current.collectLinks();
        result.current.currentFocusIndex.current = 0;

        result.current.focusPrevious();

        expect(result.current.currentFocusIndex.current).toBe(0);
      });

      it("should do nothing when no focus is set", () => {
        const { result } = renderHook(() => useActionItems());

        result.current.collectLinks();

        result.current.focusPrevious();

        expect(result.current.currentFocusIndex.current).toBeUndefined();
      });
    });
  });

  describe("resetFocus", () => {
    it("should reset focus index and clear items", () => {
      createMockElements(3, "command-menu-item");

      const { result } = renderHook(() => useActionItems());

      result.current.collectLinks();
      result.current.focusFirst();

      result.current.resetFocus();

      expect(result.current.currentFocusIndex.current).toBeUndefined();
      expect(result.current.items.current).toEqual([]);
      expect(result.current.hasAnyFocus()).toBe(false);
    });
  });

  describe("getActiveFocusedElement", () => {
    it("should return the currently focused element", () => {
      const mockElements = createMockElements(3, "command-menu-item");
      const { result } = renderHook(() => useActionItems());

      result.current.collectLinks();
      result.current.focusFirst();

      const activeElement = result.current.getActiveFocusedElement();

      expect(activeElement).toBe(mockElements[0]);
    });

    it("should return undefined when no element is focused", () => {
      const { result } = renderHook(() => useActionItems());

      const activeElement = result.current.getActiveFocusedElement();

      expect(activeElement).toBeUndefined();
    });
  });

  describe("takeAction", () => {
    it("should navigate to the href of the focused element", () => {
      createMockElements(3, "command-menu-item");

      const { result } = renderHook(() => useActionItems());

      result.current.collectLinks();
      result.current.focusFirst();

      result.current.takeAction();

      expect(mockNavigate).toHaveBeenCalledWith("/test-route-0");
    });

    it("should do nothing when no element is focused", () => {
      createMockElements(3, "command-menu-item");

      const { result } = renderHook(() => useActionItems());

      result.current.collectLinks();

      result.current.takeAction();

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe("hasAnyFocus", () => {
    it("should return true when an element is focused", () => {
      createMockElements(3, "command-menu-item");

      const { result } = renderHook(() => useActionItems());

      result.current.collectLinks();
      result.current.focusFirst();

      expect(result.current.hasAnyFocus()).toBe(true);
    });

    it("should return false when no element is focused", () => {
      const { result } = renderHook(() => useActionItems());

      expect(result.current.hasAnyFocus()).toBe(false);
    });
  });
});
