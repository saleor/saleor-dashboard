import { type IntlShape } from "react-intl";

import { getValidationSchema } from "./validationSchema";

const intl = { formatMessage: (m: { defaultMessage?: string }) => m.defaultMessage ?? "error" };

describe("getValidationSchema", () => {
  it.each([
    ["https://example.com/page", true],
    ["http://example.com:8080/path", true],
    ["example.com", false],
    ["not a url", false],
  ])("validates link %s as %s", (linkValue, valid) => {
    // Arrange
    const schema = getValidationSchema(intl as IntlShape);

    // Act
    const result = schema.safeParse({ name: "Item", linkType: "link", linkValue });

    // Assert
    expect(result.success).toBe(valid);
  });

  it("skips url validation for non-link types", () => {
    // Arrange
    const schema = getValidationSchema(intl as IntlShape);

    // Act
    const result = schema.safeParse({ name: "Item", linkType: "category", linkValue: "cat-id" });

    // Assert
    expect(result.success).toBe(true);
  });
});
