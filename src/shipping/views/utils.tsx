// @ts-strict-ignore
import { PostalCodeRuleInclusionTypeEnum } from "@dashboard/graphql";
import { MinMax } from "@dashboard/types";

export const filterPostalCodes = (postalCodes, codeToFilterOut) =>
  postalCodes.filter(
    rule => rule.start !== codeToFilterOut.start && rule.end !== codeToFilterOut.end,
  );

export const getPostalCodeRuleByMinMax =
  ({ min, max }) =>
  ({ start, end }) =>
    start === min && end === max;

export const getRuleObject = (rule: MinMax, inclusionType: PostalCodeRuleInclusionTypeEnum) => ({
  __typename: undefined,
  end: rule.max,
  id: undefined,
  inclusionType,
  start: rule.min,
});
