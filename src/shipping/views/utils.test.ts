import { PostalCodeRuleInclusionTypeEnum } from "@dashboard/graphql";

import { mapPostalCodeRulesInclusionType } from "./utils";

describe("mapPostalCodeRulesInclusionType", () => {
  it("updates inclusion type on existing rules without clearing them", () => {
    // Arrange
    const rules = [
      {
        id: "rule-1",
        start: "10000",
        end: "20000",
        inclusionType: PostalCodeRuleInclusionTypeEnum.EXCLUDE,
      },
      {
        id: "rule-2",
        start: "30000",
        end: null,
        inclusionType: PostalCodeRuleInclusionTypeEnum.EXCLUDE,
      },
    ];

    // Act
    const result = mapPostalCodeRulesInclusionType(rules, PostalCodeRuleInclusionTypeEnum.INCLUDE);

    // Assert
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      id: "rule-1",
      start: "10000",
      end: "20000",
      inclusionType: PostalCodeRuleInclusionTypeEnum.INCLUDE,
    });
    expect(result[1]).toMatchObject({
      id: "rule-2",
      start: "30000",
      inclusionType: PostalCodeRuleInclusionTypeEnum.INCLUDE,
    });
  });

  it("returns an empty array when rules are missing", () => {
    // Act
    const result = mapPostalCodeRulesInclusionType(
      undefined,
      PostalCodeRuleInclusionTypeEnum.INCLUDE,
    );

    // Assert
    expect(result).toEqual([]);
  });
});
