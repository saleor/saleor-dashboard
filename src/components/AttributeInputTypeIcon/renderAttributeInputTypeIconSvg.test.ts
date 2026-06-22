import { AttributeInputTypeEnum } from "@dashboard/graphql";

import { iconNodeToSvg } from "./iconNodeToSvg";
import { renderAttributeInputTypeIconSvg } from "./renderAttributeInputTypeIconSvg";

describe("renderAttributeInputTypeIconSvg", () => {
  it("returns browser-safe svg markup without react-dom/server", () => {
    // Arrange
    const inputType = AttributeInputTypeEnum.BOOLEAN;

    // Act
    const result = renderAttributeInputTypeIconSvg(inputType, "xsmall", "#111111");

    // Assert
    expect(result.startsWith("<svg")).toBe(true);
    expect(result).toContain('stroke="#111111"');
    expect(result).toContain("<rect");
  });

  it("escapes special characters in color", () => {
    // Arrange
    const iconNode = [["path", { d: "M0 0", key: "a" }]] as const;

    // Act
    const result = iconNodeToSvg(iconNode, 12, 2, '"><script>');

    // Assert
    expect(result).toContain('stroke="&quot;&gt;&lt;script&gt;"');
  });
});
