import { formatCatalogCount } from "./formatCatalogCount";

describe("formatCatalogCount", () => {
  it("formats small counts with standard notation", () => {
    expect(formatCatalogCount(31, "en-US")).toBe("31");
    expect(formatCatalogCount(1280, "en-US")).toBe("1,280");
  });

  it("uses compact notation for large counts", () => {
    expect(formatCatalogCount(150_000, "en-US")).toBe("150K");
  });
});
