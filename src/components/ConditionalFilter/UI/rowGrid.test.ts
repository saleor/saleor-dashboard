import { getGridTemplateColumns } from "./rowGrid";

describe("getGridTemplateColumns", () => {
  it("gives the value column leftover space in the conditions popover", () => {
    // Arrange & Act
    const attribute = getGridTemplateColumns("popover", true);
    const standard = getGridTemplateColumns("popover", false);

    // Assert
    expect(attribute).toBe("140px 160px 80px 200px auto");
    expect(standard).toBe("140px 80px 200px auto");
  });

  it("uses the same flexible tracks for the list filter panel as inline", () => {
    // Arrange & Act & Assert
    expect(getGridTemplateColumns("panel", false)).toBe(getGridTemplateColumns("inline", false));
    expect(getGridTemplateColumns("panel", true)).toBe(getGridTemplateColumns("inline", true));
  });

  it("keeps the value column as the widest flex track on the inline layout", () => {
    // Arrange & Act
    const attribute = getGridTemplateColumns("inline", true);
    const standard = getGridTemplateColumns("inline", false);

    // Assert
    expect(attribute).toContain("minmax(200px, 2.2fr)");
    expect(standard).toContain("minmax(200px, 2.2fr)");
    expect(attribute.endsWith(" auto")).toBe(true);
  });
});
