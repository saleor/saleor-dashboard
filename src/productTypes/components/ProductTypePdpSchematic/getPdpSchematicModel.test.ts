import {
  firstAttributeChoiceName,
  getPdpSchematicModel,
  isColorAttributeName,
  truncateSchematicSample,
} from "./getPdpSchematicModel";

const choices = (...names: string[]) => ({
  edges: names.map(name => ({ node: { name } })),
});

describe("getPdpSchematicModel", () => {
  const productAttributes = [
    { id: "brand", name: "Brand", choices: choices("Saleor") },
    { id: "material", name: "Material" },
  ];
  const assignedVariantAttributes = [
    { variantSelection: true, attribute: { id: "color", name: "Color" } },
    { variantSelection: true, attribute: { id: "size", name: "Size", choices: choices("S") } },
    { variantSelection: false, attribute: { id: "fit", name: "Fit", choices: choices("Relaxed") } },
  ];

  it("puts product attributes in the details list and selection attributes in pickers", () => {
    // Arrange & Act
    const model = getPdpSchematicModel({
      hasVariants: true,
      productAttributes,
      assignedVariantAttributes,
      selectedVariantAttributeIds: ["color", "size"],
    });

    // Assert
    expect(model.specAttributes.map(attribute => attribute.name)).toEqual(["Brand", "Material"]);
    expect(model.specAttributes[0].sampleValue).toBe("Saleor");
    expect(model.specAttributes[1].sampleValue).toBeNull();
    expect(model.optionAttributes.map(attribute => attribute.name)).toEqual(["Color", "Size"]);
    expect(model.badgeAttributes.map(attribute => attribute.name)).toEqual(["Fit"]);
    expect(model.badgeAttributes[0].sampleValue).toBe("Relaxed");
  });

  it("hides pickers and badges when the type does not use options", () => {
    // Arrange & Act
    const model = getPdpSchematicModel({
      hasVariants: false,
      productAttributes,
      assignedVariantAttributes,
      selectedVariantAttributeIds: ["color"],
    });

    // Assert
    expect(model.optionAttributes).toEqual([]);
    expect(model.badgeAttributes).toEqual([]);
    expect(model.specAttributes).toHaveLength(2);
  });

  it("treats an empty live selection as no pickers, even when saved flags still have them", () => {
    // Arrange & Act
    const model = getPdpSchematicModel({
      hasVariants: true,
      productAttributes,
      assignedVariantAttributes,
      selectedVariantAttributeIds: [],
    });

    // Assert
    expect(model.optionAttributes).toEqual([]);
    expect(model.badgeAttributes.map(attribute => attribute.id)).toEqual(["color", "size", "fit"]);
  });
});

describe("isColorAttributeName", () => {
  it("treats color and colour as swatch attributes", () => {
    // Assert
    expect(isColorAttributeName("Color")).toBe(true);
    expect(isColorAttributeName("colour")).toBe(true);
    expect(isColorAttributeName("Size")).toBe(false);
  });
});

describe("firstAttributeChoiceName", () => {
  it("returns the first defined choice, truncated", () => {
    // Assert
    expect(firstAttributeChoiceName(choices("GOTS"))).toBe("GOTS");
    expect(firstAttributeChoiceName(choices("OEKO-TEX Standard 100"))).toBe("OEKO-TEX Standa…");
    expect(firstAttributeChoiceName(choices("  "))).toBeNull();
    expect(firstAttributeChoiceName({ edges: [] })).toBeNull();
    expect(firstAttributeChoiceName(undefined)).toBeNull();
  });
});

describe("truncateSchematicSample", () => {
  it("keeps short values and ellipsizes long ones", () => {
    // Assert
    expect(truncateSchematicSample("Poland")).toBe("Poland");
    expect(truncateSchematicSample("OEKO-TEX Standard 100")).toBe("OEKO-TEX Standa…");
  });
});
