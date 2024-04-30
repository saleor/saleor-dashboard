import { ProductTopToday } from "@dashboard/home/types";

import { generateAttributesInfo } from "./variant";

describe("HomeProductList / variant", () => {
  it("generates attributes string", () => {
    // Arrange
    const variant = {
      attributes: [
        { values: [{ name: "attr1" }] },
        { values: [{ name: "attr2" }] },
        { values: [] },
        { values: [{ name: "attr4" }] },
      ],
    } as ProductTopToday[number];
    // Act
    const attributesString = generateAttributesInfo(variant);

    // Assert
    expect(attributesString).toBe("attr1 / attr2 / attr4");
  });
});
