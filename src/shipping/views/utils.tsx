import {
  PostalCodeRuleInclusionTypeEnum,
  ShippingMethodWithPostalCodesFragment,
} from "@dashboard/graphql";
import { MinMax } from "@dashboard/types";

type PostalCodeRule = NonNullable<ShippingMethodWithPostalCodesFragment["postalCodeRules"]>[number];

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

export const getRuleObject = (
  rule: MinMax,
  inclusionType: PostalCodeRuleInclusionTypeEnum,
): PostalCodeRule => ({
  __typename: "ShippingMethodPostalCodeRule" as const,
  end: rule.max,
  id: "0",
  inclusionType,
  start: rule.min,
});
