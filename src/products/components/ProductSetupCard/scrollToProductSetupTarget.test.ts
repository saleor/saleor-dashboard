import { scrollToProductSetupTarget } from "./scrollToProductSetupTarget";

const appendInScrollPort = (child: HTMLElement): HTMLElement => {
  const root = document.createElement("div");

  root.style.overflowY = "auto";
  root.setAttribute("data-detail-content-scroll", "true");
  Object.defineProperty(root, "scrollTop", { value: 0, writable: true });
  Object.defineProperty(root, "scrollHeight", { configurable: true, value: 1800 });
  root.scrollTo = jest.fn();
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
  child.getBoundingClientRect = () =>
    ({
      top: 240,
      left: 0,
      bottom: 440,
      right: 400,
      width: 400,
      height: 200,
      x: 0,
      y: 240,
      toJSON: () => ({}),
    }) as DOMRect;
  root.appendChild(child);
  document.body.appendChild(root);

  return root;
};

describe("scrollToProductSetupTarget", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("scrolls the content pane to the product media card", () => {
    // Arrange
    const media = document.createElement("div");

    media.setAttribute("data-test-id", "product-media");

    const root = appendInScrollPort(media);

    // Act
    scrollToProductSetupTarget("media");

    // Assert
    expect(root.scrollTo).toHaveBeenCalledWith({ top: 240, behavior: "smooth" });
  });

  it("expands collapsed SEO then pins the content pane to the bottom", () => {
    // Arrange
    const seo = document.createElement("div");

    seo.setAttribute("data-test-id", "seo-form");
    seo.setAttribute("data-expanded", "false");

    const trigger = document.createElement("button");

    trigger.setAttribute("data-test-id", "edit-seo");
    trigger.addEventListener("click", () => seo.setAttribute("data-expanded", "true"));
    seo.appendChild(trigger);

    const root = appendInScrollPort(seo);

    // Act
    scrollToProductSetupTarget("seo");

    // Assert
    expect(seo.getAttribute("data-expanded")).toBe("true");
    expect(root.scrollTo).toHaveBeenCalledWith({ top: 1800, behavior: "auto" });
  });

  it("does not collapse SEO that is already expanded", () => {
    // Arrange
    const seo = document.createElement("div");

    seo.setAttribute("data-test-id", "seo-form");
    seo.setAttribute("data-expanded", "true");

    const trigger = document.createElement("button");

    trigger.setAttribute("data-test-id", "edit-seo");

    const onClick = jest.fn();

    trigger.addEventListener("click", onClick);
    seo.appendChild(trigger);

    const root = appendInScrollPort(seo);

    // Act
    scrollToProductSetupTarget("seo");

    // Assert
    expect(onClick).not.toHaveBeenCalled();
    expect(root.scrollTo).toHaveBeenCalledWith({ top: 1800, behavior: "auto" });
  });
});
