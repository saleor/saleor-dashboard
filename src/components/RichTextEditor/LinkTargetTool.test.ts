import { type API } from "@editorjs/editorjs";

import { LinkTargetTool } from "./LinkTargetTool";

interface ToggleItem {
  isActive: boolean;
  isDisabled: boolean;
  onActivate: () => void;
}

const renderTool = (link: HTMLElement | null): ToggleItem => {
  const api = { selection: { findParentTag: () => link } } as unknown as API;

  const [item] = new LinkTargetTool({ api }).render() as unknown as [ToggleItem];

  return item;
};

const createLink = (target?: string): HTMLAnchorElement => {
  const link = document.createElement("a");

  link.href = "https://saleor.io";

  if (target) {
    link.setAttribute("target", target);
  }

  return link;
};

describe("LinkTargetTool", () => {
  it("ends the link group with a separator", () => {
    // Arrange
    const api = { selection: { findParentTag: () => null } } as unknown as API;

    // Act
    const items = new LinkTargetTool({ api }).render();

    // Assert
    expect(items).toEqual([expect.anything(), { type: "separator" }]);
  });

  it("is disabled when the selection is not inside a link", () => {
    // Arrange & Act
    const item = renderTool(null);

    // Assert
    expect(item.isDisabled).toBe(true);
    expect(item.isActive).toBe(false);
    expect(() => item.onActivate()).not.toThrow();
  });

  it("makes a link open in a new tab", () => {
    // Arrange
    const link = createLink();
    const item = renderTool(link);

    // Act
    item.onActivate();

    // Assert
    expect(item.isDisabled).toBe(false);
    expect(item.isActive).toBe(false);
    expect(link.getAttribute("target")).toBe("_blank");
  });

  it("makes a new-tab link open in the same tab again", () => {
    // Arrange
    const link = createLink("_blank");
    const item = renderTool(link);

    // Act
    item.onActivate();

    // Assert
    expect(item.isActive).toBe(true);
    expect(link.hasAttribute("target")).toBe(false);
  });
});
