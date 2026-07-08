import { renderHook } from "@testing-library/react";

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
      element.id = `/test-route-${i}`;
      element.setAttribute = jest.fn();
      elements.push(element);
    }

    return elements;
  };

  const createContainerWithItems = () => {
    const container = document.createElement("div");
    const mockElements = createMockElements(3, "command-menu-item");

    mockElements.forEach(element => {
      container.appendChild(element);
    });

    document.body.appendChild(container);

    return { container, mockElements };
  };

  describe("initial state", () => {
    it("should initialize with empty items and undefined focus", () => {
      const { result } = renderHook(() => useActionItems());

      expect(result.current.items.current).toEqual([]);
      expect(result.current.currentFocusIndex.current).toBeUndefined();
      expect(result.current.hasAnyFocus()).toBe(false);
    });
  });

  describe("collectItems", () => {
    it("should collect command menu items and rows in DOM order", () => {
      const { container, mockElements } = createContainerWithItems();
      const row = document.createElement("tr");

      row.dataset.href = "/order-1";
      row.setAttribute = jest.fn();
      container.appendChild(row);

      const { result } = renderHook(() => useActionItems());

      result.current.collectItems(container);

      expect(result.current.items.current).toHaveLength(4);
      expect(result.current.items.current.slice(0, 3)).toEqual(mockElements);
      expect(result.current.items.current[3]).toBe(row);
    });

    it("should replace existing items", () => {
      const { container } = createContainerWithItems();
      const { result } = renderHook(() => useActionItems());

      result.current.items.current.push(document.createElement("div"));
      result.current.collectItems(container);

      expect(result.current.items.current).toHaveLength(3);
    });

    it("should clear items when container is null", () => {
      const { result } = renderHook(() => useActionItems());

      result.current.items.current.push(document.createElement("div"));
      result.current.collectItems(null);

      expect(result.current.items.current).toEqual([]);
    });
  });

  describe("focus management", () => {
    let mockElements: HTMLElement[];
    let container: HTMLDivElement;

    beforeEach(() => {
      ({ container, mockElements } = createContainerWithItems());
    });

    describe("restoreFocus", () => {
      it("should set focus to first element", () => {
        const { result } = renderHook(() => useActionItems());

        result.current.collectItems(container);
        result.current.restoreFocus();

        expect(result.current.currentFocusIndex.current).toBe(0);
        expect(mockElements[0].setAttribute).toHaveBeenCalledWith("data-focus", "true");
        expect(mockElements[0].setAttribute).toHaveBeenCalledWith("aria-selected", "true");
        expect(mockScrollIntoView).toHaveBeenCalled();
      });

      it("should restore focus to a preferred element when it still exists", () => {
        const { result } = renderHook(() => useActionItems());

        result.current.collectItems(container);
        result.current.restoreFocus(mockElements[2].id);

        expect(result.current.currentFocusIndex.current).toBe(2);
        expect(mockElements[2].setAttribute).toHaveBeenCalledWith("data-focus", "true");
      });
    });

    describe("focusFirst", () => {
      it("should focus the first element", () => {
        const { result } = renderHook(() => useActionItems());

        result.current.collectItems(container);
        result.current.focusFirst();

        expect(result.current.currentFocusIndex.current).toBe(0);
        expect(mockElements[0].setAttribute).toHaveBeenCalledWith("data-focus", "true");
      });
    });

    describe("focusNext", () => {
      it("should move focus to next element", () => {
        const { result } = renderHook(() => useActionItems());

        result.current.collectItems(container);
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

        result.current.collectItems(container);
        result.current.currentFocusIndex.current = 2;

        result.current.focusNext();

        expect(result.current.currentFocusIndex.current).toBe(0);
      });

      it("should do nothing when no focus is set", () => {
        const { result } = renderHook(() => useActionItems());

        result.current.collectItems(container);

        result.current.focusNext();

        expect(result.current.currentFocusIndex.current).toBeUndefined();
      });
    });

    describe("focusPrevious", () => {
      it("should move focus to previous element", () => {
        const { result } = renderHook(() => useActionItems());

        result.current.collectItems(container);
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

        result.current.collectItems(container);
        result.current.currentFocusIndex.current = 0;

        result.current.focusPrevious();

        expect(result.current.currentFocusIndex.current).toBe(0);
      });

      it("should do nothing when no focus is set", () => {
        const { result } = renderHook(() => useActionItems());

        result.current.collectItems(container);

        result.current.focusPrevious();

        expect(result.current.currentFocusIndex.current).toBeUndefined();
      });
    });
  });

  describe("resetFocus", () => {
    it("should reset focus index and clear items", () => {
      const { container } = createContainerWithItems();
      const { result } = renderHook(() => useActionItems());

      result.current.collectItems(container);
      result.current.focusFirst();

      result.current.resetFocus();

      expect(result.current.currentFocusIndex.current).toBeUndefined();
      expect(result.current.items.current).toEqual([]);
      expect(result.current.hasAnyFocus()).toBe(false);
    });
  });

  describe("getActiveFocusedElement", () => {
    it("should return the currently focused element", () => {
      const { container, mockElements } = createContainerWithItems();
      const { result } = renderHook(() => useActionItems());

      result.current.collectItems(container);
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
      const { container } = createContainerWithItems();
      const { result } = renderHook(() => useActionItems());

      result.current.collectItems(container);
      result.current.focusFirst();

      result.current.takeAction();

      expect(mockNavigate).toHaveBeenCalledWith("/test-route-0");
    });

    it("should do nothing when no element is focused", () => {
      const { container } = createContainerWithItems();
      const { result } = renderHook(() => useActionItems());

      result.current.collectItems(container);

      result.current.takeAction();

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe("hasAnyFocus", () => {
    it("should return true when an element is focused", () => {
      const { container } = createContainerWithItems();
      const { result } = renderHook(() => useActionItems());

      result.current.collectItems(container);
      result.current.focusFirst();

      expect(result.current.hasAnyFocus()).toBe(true);
    });

    it("should return false when no element is focused", () => {
      const { result } = renderHook(() => useActionItems());

      expect(result.current.hasAnyFocus()).toBe(false);
    });
  });
});
