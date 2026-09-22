import { renderEmptyImageIconSvg } from "./renderEmptyImageIconSvg";

describe("renderEmptyImageIconSvg", () => {
  it("returns Lucide Image svg markup for canvas thumbnails", () => {
    // Arrange & Act
    const result = renderEmptyImageIconSvg("#6b7280");

    // Assert
    expect(result.startsWith("<svg")).toBe(true);
    expect(result).toContain('stroke="#6b7280"');
    expect(result).toContain("<rect");
    expect(result).toContain("<circle");
  });
});
