import { PostalCodeRuleInclusionTypeEnum } from "@dashboard/graphql";
import { MinMax } from "@dashboard/types";

interface PostalCodeRule {
  start: string | null;
  end: string | null;
  id?: string;
  inclusionType?: PostalCodeRuleInclusionTypeEnum | null;
}

export const filterPostalCodes = (
  postalCodes: PostalCodeRule[],
  codeToFilterOut: PostalCodeRule,
): PostalCodeRule[] =>
  postalCodes.filter(
    rule => rule.start !== codeToFilterOut.start && rule.end !== codeToFilterOut.end,
  );

export const getPostalCodeRuleByMinMax =
  ({ min, max }: MinMax) =>
  ({ start, end }: PostalCodeRule): boolean =>
    start === min && end === max;

export const getRuleObject = (rule: MinMax, inclusionType: PostalCodeRuleInclusionTypeEnum) => ({
  __typename: undefined,
  end: rule.max,
  id: undefined,
  inclusionType,
  start: rule.min,
});
