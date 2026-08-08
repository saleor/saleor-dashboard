import { renderVoucherScopeIconSvg } from "./renderVoucherScopeIconSvg";

describe("renderVoucherScopeIconSvg", () => {
  it("renders an SVG for each voucher scope icon", () => {
    // Arrange // Act // Assert
    for (const kind of ["entireOrder", "products", "shipping"] as const) {
      const svg = renderVoucherScopeIconSvg(kind, 12, "#111111");

      expect(svg.startsWith("<svg")).toBe(true);
      expect(svg).toContain("#111111");
      expect(svg).not.toContain("<script");
    }
  });
});
