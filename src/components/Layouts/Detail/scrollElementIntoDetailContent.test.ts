import {
  getDetailContentScrollParent,
  scrollElementIntoDetailContent,
  scrollToDetailSection,
} from "./scrollElementIntoDetailContent";

describe("scrollElementIntoDetailContent", () => {
  const OriginalResizeObserver = window.ResizeObserver;
  const originalWindowScrollTo = window.scrollTo;

  const drainPendingEndScroll = (): void => {
    const root = document.createElement("div");
    const element = document.createElement("div");
    const emptyRect = {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect;

    root.setAttribute("data-detail-content-scroll", "true");
    Object.defineProperty(root, "scrollTop", { value: 0, writable: true });
    root.scrollTo = jest.fn();
    root.getBoundingClientRect = () => emptyRect;
    element.getBoundingClientRect = () => emptyRect;
    root.appendChild(element);
    document.body.appendChild(root);
    scrollElementIntoDetailContent(element);
  };

  afterEach(() => {
    window.ResizeObserver = OriginalResizeObserver;
    window.scrollTo = originalWindowScrollTo;
    jest.useRealTimers();
    drainPendingEndScroll();
    document.body.innerHTML = "";
  });

  it("scrolls the overflow parent so the element top aligns with the content top", () => {
    // Arrange
    const root = document.createElement("div");
    const element = document.createElement("div");

    root.style.overflowY = "auto";
    Object.defineProperty(root, "scrollTop", { value: 40, writable: true });
    root.scrollTo = jest.fn();
    root.getBoundingClientRect = () =>
      ({
        top: 80,
        left: 0,
        bottom: 580,
        right: 400,
        width: 400,
        height: 500,
        x: 0,
        y: 80,
        toJSON: () => ({}),
      }) as DOMRect;
    element.getBoundingClientRect = () =>
      ({
        top: 360,
        left: 0,
        bottom: 560,
        right: 400,
        width: 400,
        height: 200,
        x: 0,
        y: 360,
        toJSON: () => ({}),
      }) as DOMRect;

    root.appendChild(element);
    document.body.appendChild(root);

    // Act
    scrollElementIntoDetailContent(element);

    // Assert — 40 + (360 - 80) = 320
    expect(root.scrollTo).toHaveBeenCalledWith({ top: 320, behavior: "smooth" });
  });

  it("scrolls the overflow parent to the bottom when align is end", () => {
    // Arrange
    const root = document.createElement("div");
    const element = document.createElement("div");

    root.style.overflowY = "auto";
    Object.defineProperty(root, "scrollHeight", { configurable: true, value: 1800 });
    root.scrollTo = jest.fn();
    root.appendChild(element);
    document.body.appendChild(root);

    // Act
    scrollElementIntoDetailContent(element, { align: "end" });

    // Assert
    expect(root.scrollTo).toHaveBeenCalledWith({ top: 1800, behavior: "auto" });
  });

  it("re-pins to the bottom when the target grows", () => {
    // Arrange
    const root = document.createElement("div");
    const element = document.createElement("div");
    const observers: ResizeObserverCallback[] = [];

    class FakeResizeObserver {
      public constructor(callback: ResizeObserverCallback) {
        observers.push(callback);
      }

      public observe(): void {
        return undefined;
      }

      public disconnect(): void {
        return undefined;
      }

      public unobserve(): void {
        return undefined;
      }
    }

    window.ResizeObserver = FakeResizeObserver as unknown as typeof ResizeObserver;

    root.style.overflowY = "auto";
    Object.defineProperty(root, "scrollHeight", {
      configurable: true,
      writable: true,
      value: 1800,
    });
    root.scrollTo = jest.fn();
    root.appendChild(element);
    document.body.appendChild(root);

    // Act
    scrollElementIntoDetailContent(element, { align: "end" });
    Object.defineProperty(root, "scrollHeight", {
      configurable: true,
      writable: true,
      value: 2400,
    });
    observers[0]?.([], {
      disconnect(): void {
        return undefined;
      },
      observe(): void {
        return undefined;
      },
      unobserve(): void {
        return undefined;
      },
    });

    // Assert
    expect(root.scrollTo).toHaveBeenLastCalledWith({ top: 2400, behavior: "auto" });
  });

  it("cancels end-pin when scrolling another section to start", () => {
    // Arrange
    drainPendingEndScroll();
    jest.useFakeTimers();

    const root = document.createElement("div");
    const seo = document.createElement("div");
    const media = document.createElement("div");

    root.style.overflowY = "auto";
    Object.defineProperty(root, "scrollHeight", { configurable: true, value: 1800 });
    root.scrollTo = jest.fn();
    root.appendChild(seo);
    root.appendChild(media);
    document.body.appendChild(root);

    scrollElementIntoDetailContent(seo, { align: "end" });
    (root.scrollTo as jest.Mock).mockClear();

    media.getBoundingClientRect = () =>
      ({
        top: 120,
        left: 0,
        bottom: 320,
        right: 400,
        width: 400,
        height: 200,
        x: 0,
        y: 120,
        toJSON: () => ({}),
      }) as DOMRect;
    root.getBoundingClientRect = () =>
      ({
        top: 0,
        left: 0,
        bottom: 500,
        right: 400,
        width: 400,
        height: 500,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect;
    Object.defineProperty(root, "scrollTop", { configurable: true, writable: true, value: 0 });

    // Act
    scrollElementIntoDetailContent(media);
    jest.advanceTimersByTime(500);

    // Assert — SEO's delayed pin must not yank the pane back to the bottom
    expect(root.scrollTo).not.toHaveBeenCalledWith({ top: 1800, behavior: "auto" });
  });

  it("prefers the marked detail content scrollport", () => {
    // Arrange
    const root = document.createElement("div");
    const wrapper = document.createElement("div");
    const element = document.createElement("div");

    root.setAttribute("data-detail-content-scroll", "true");
    wrapper.appendChild(element);
    root.appendChild(wrapper);
    document.body.appendChild(root);

    // Act
    const parent = getDetailContentScrollParent(element);

    // Assert
    expect(parent).toBe(root);
  });

  it("finds the nearest overflow-y ancestor", () => {
    // Arrange
    const root = document.createElement("div");
    const wrapper = document.createElement("div");
    const element = document.createElement("div");

    root.style.overflowY = "auto";
    wrapper.appendChild(element);
    root.appendChild(wrapper);
    document.body.appendChild(root);

    // Act
    const parent = getDetailContentScrollParent(element);

    // Assert
    expect(parent).toBe(root);
  });

  it("resets ancestor scroll so TopNav is not left shifted", () => {
    // Arrange
    const shell = document.createElement("div");
    const root = document.createElement("div");
    const element = document.createElement("div");

    Object.defineProperty(shell, "scrollTop", { configurable: true, writable: true, value: 96 });
    root.setAttribute("data-detail-content-scroll", "true");
    Object.defineProperty(root, "scrollTop", { value: 0, writable: true });
    root.scrollTo = jest.fn();
    root.getBoundingClientRect = () =>
      ({
        top: 80,
        left: 0,
        bottom: 580,
        right: 400,
        width: 400,
        height: 500,
        x: 0,
        y: 80,
        toJSON: () => ({}),
      }) as DOMRect;
    element.getBoundingClientRect = () =>
      ({
        top: 80,
        left: 0,
        bottom: 280,
        right: 400,
        width: 400,
        height: 200,
        x: 0,
        y: 80,
        toJSON: () => ({}),
      }) as DOMRect;

    const scrollToWindow = jest.fn();

    window.scrollTo = scrollToWindow;
    root.appendChild(element);
    shell.appendChild(root);
    document.body.appendChild(shell);

    // Act
    scrollElementIntoDetailContent(element);

    // Assert
    expect(shell.scrollTop).toBe(0);
    expect(scrollToWindow).toHaveBeenCalledWith(0, 0);
  });
});

describe("scrollToDetailSection", () => {
  const nativeGetElementById = Document.prototype.getElementById;

  beforeEach(() => {
    // testUtils/setup stubs getElementById to always return a detached div.
    document.getElementById = (id: string) => nativeGetElementById.call(document, id);
  });

  afterEach(() => {
    document.getElementById = () => document.createElement("div");
    document.body.innerHTML = "";
  });

  it("scrolls the detail content pane instead of using scrollIntoView", () => {
    // Arrange
    const root = document.createElement("div");
    const element = document.createElement("div");

    root.setAttribute("data-detail-content-scroll", "true");
    Object.defineProperty(root, "scrollTop", { value: 0, writable: true });
    root.scrollTo = jest.fn();
    root.getBoundingClientRect = () =>
      ({
        top: 80,
        left: 0,
        bottom: 580,
        right: 400,
        width: 400,
        height: 500,
        x: 0,
        y: 80,
        toJSON: () => ({}),
      }) as DOMRect;
    element.id = "email-delivery";
    element.getBoundingClientRect = () =>
      ({
        top: 360,
        left: 0,
        bottom: 560,
        right: 400,
        width: 400,
        height: 200,
        x: 0,
        y: 360,
        toJSON: () => ({}),
      }) as DOMRect;
    element.scrollIntoView = jest.fn();
    root.appendChild(element);
    document.body.appendChild(root);

    // Act
    const found = scrollToDetailSection("email-delivery");

    // Assert — 0 + (360 - 80) = 280
    expect(found).toBe(true);
    expect(root.scrollTo).toHaveBeenCalledWith({ top: 280, behavior: "smooth" });
    expect(element.scrollIntoView).not.toHaveBeenCalled();
  });

  it("returns false when the target is not mounted", () => {
    // Act
    const found = scrollToDetailSection("email-delivery");

    // Assert
    expect(found).toBe(false);
  });
});
