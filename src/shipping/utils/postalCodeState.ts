import { PostalCodeRuleInclusionTypeEnum } from "@dashboard/graphql";
import isEqual from "lodash/isEqual";

type PostalCodeRuleLike = {
  id?: string | null;
  start?: string | null;
  end?: string | null;
  inclusionType?: PostalCodeRuleInclusionTypeEnum | null;
};

export interface PostalCodeEditorState {
  postalCodeRules?: PostalCodeRuleLike[] | null;
  inclusionType?: PostalCodeRuleInclusionTypeEnum;
  codesToDelete?: string[];
}

export function resolvePostalCodeInclusionType(
  postalCodeRules: PostalCodeRuleLike[] | null | undefined,
  inclusionType?: PostalCodeRuleInclusionTypeEnum,
): PostalCodeRuleInclusionTypeEnum {
  return (
    postalCodeRules?.[0]?.inclusionType ?? inclusionType ?? PostalCodeRuleInclusionTypeEnum.EXCLUDE
  );
}

// A rule's identity for dirty-detection is its (start, end) range. The `id` is
// intentionally excluded: locally added rules have no id until they are saved,
// and after a save+refetch the server assigns one. Comparing ids would keep the
// form dirty forever after saving a newly added range.
function getComparablePostalCodeRules(rules: PostalCodeRuleLike[] | null | undefined) {
  return [...(rules ?? [])]
    .sort(
      (leftRule, rightRule) =>
        (leftRule.start ?? "").localeCompare(rightRule.start ?? "") ||
        (leftRule.end ?? "").localeCompare(rightRule.end ?? ""),
    )
    .map(rule => ({
      end: rule.end ?? "",
      start: rule.start ?? "",
    }));
}

export function hasPostalCodeStateChanges(
  current: PostalCodeEditorState,
  saved: PostalCodeEditorState,
): boolean {
  if ((current.codesToDelete?.length ?? 0) > 0) {
    return true;
  }

  const currentInclusion = resolvePostalCodeInclusionType(
    current.postalCodeRules,
    current.inclusionType,
  );
  const savedInclusion = resolvePostalCodeInclusionType(saved.postalCodeRules, saved.inclusionType);

  if (currentInclusion !== savedInclusion) {
    return true;
  }

  return !isEqual(
    getComparablePostalCodeRules(current.postalCodeRules),
    getComparablePostalCodeRules(saved.postalCodeRules),
  );
}
