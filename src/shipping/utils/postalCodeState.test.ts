import { PostalCodeRuleInclusionTypeEnum } from "@dashboard/graphql";

import { hasPostalCodeStateChanges } from "./postalCodeState";

const savedRules = [
  {
    id: "rule-1",
    start: "10000",
    end: "20000",
    inclusionType: PostalCodeRuleInclusionTypeEnum.EXCLUDE,
  },
];

const savedState = {
  postalCodeRules: savedRules,
  inclusionType: PostalCodeRuleInclusionTypeEnum.EXCLUDE,
  codesToDelete: [],
};

describe("hasPostalCodeStateChanges", () => {
  it("returns false when current state matches saved state", () => {
    // Assert
    expect(
      hasPostalCodeStateChanges(
        {
          postalCodeRules: savedRules,
          inclusionType: PostalCodeRuleInclusionTypeEnum.EXCLUDE,
          codesToDelete: [],
        },
        savedState,
      ),
    ).toBe(false);
  });

  it("returns false after toggling inclusion back to the original value", () => {
    // Arrange
    const toggledToInclude = savedRules.map(rule => ({
      ...rule,
      inclusionType: PostalCodeRuleInclusionTypeEnum.INCLUDE,
    }));

    // Assert
    expect(
      hasPostalCodeStateChanges(
        {
          postalCodeRules: toggledToInclude,
          inclusionType: PostalCodeRuleInclusionTypeEnum.INCLUDE,
          codesToDelete: [],
        },
        savedState,
      ),
    ).toBe(true);

    expect(
      hasPostalCodeStateChanges(
        {
          postalCodeRules: savedRules,
          inclusionType: PostalCodeRuleInclusionTypeEnum.EXCLUDE,
          codesToDelete: [],
        },
        savedState,
      ),
    ).toBe(false);
  });

  it("returns false after adding and removing a new postal code range", () => {
    // Arrange
    const withNewRule = [
      ...savedRules,
      {
        start: "30000",
        end: "40000",
        inclusionType: PostalCodeRuleInclusionTypeEnum.EXCLUDE,
      },
    ];

    // Assert
    expect(
      hasPostalCodeStateChanges(
        {
          postalCodeRules: withNewRule,
          inclusionType: PostalCodeRuleInclusionTypeEnum.EXCLUDE,
          codesToDelete: [],
        },
        savedState,
      ),
    ).toBe(true);

    expect(
      hasPostalCodeStateChanges(
        {
          postalCodeRules: savedRules,
          inclusionType: PostalCodeRuleInclusionTypeEnum.EXCLUDE,
          codesToDelete: [],
        },
        savedState,
      ),
    ).toBe(false);
  });

  it("returns false after saving a newly added range (local rule has no id, refetched rule does)", () => {
    // Arrange - mirrors post-save: the local state still holds the rule we added
    // (created without an id), while the refetched saved state has the same range
    // with a server-assigned id.
    const localRuleWithoutId = {
      id: undefined,
      start: "30000",
      end: "40000",
      inclusionType: PostalCodeRuleInclusionTypeEnum.EXCLUDE,
    };
    const refetchedSavedState = {
      postalCodeRules: [
        ...savedRules,
        {
          id: "rule-2",
          start: "30000",
          end: "40000",
          inclusionType: PostalCodeRuleInclusionTypeEnum.EXCLUDE,
        },
      ],
      inclusionType: PostalCodeRuleInclusionTypeEnum.EXCLUDE,
      codesToDelete: [],
    };

    // Assert
    expect(
      hasPostalCodeStateChanges(
        {
          postalCodeRules: [...savedRules, localRuleWithoutId],
          inclusionType: PostalCodeRuleInclusionTypeEnum.EXCLUDE,
          codesToDelete: [],
        },
        refetchedSavedState,
      ),
    ).toBe(false);
  });

  it("returns true when a saved postal code is marked for deletion", () => {
    // Assert
    expect(
      hasPostalCodeStateChanges(
        {
          postalCodeRules: [],
          inclusionType: PostalCodeRuleInclusionTypeEnum.EXCLUDE,
          codesToDelete: ["rule-1"],
        },
        savedState,
      ),
    ).toBe(true);
  });

  it("returns false after toggling inclusion with no postal codes back to default", () => {
    // Arrange
    const emptySavedState = {
      postalCodeRules: [],
      inclusionType: PostalCodeRuleInclusionTypeEnum.EXCLUDE,
      codesToDelete: [],
    };

    // Assert
    expect(
      hasPostalCodeStateChanges(
        {
          postalCodeRules: [],
          inclusionType: PostalCodeRuleInclusionTypeEnum.INCLUDE,
          codesToDelete: [],
        },
        emptySavedState,
      ),
    ).toBe(true);

    expect(
      hasPostalCodeStateChanges(
        {
          postalCodeRules: [],
          inclusionType: PostalCodeRuleInclusionTypeEnum.EXCLUDE,
          codesToDelete: [],
        },
        emptySavedState,
      ),
    ).toBe(false);
  });
});
