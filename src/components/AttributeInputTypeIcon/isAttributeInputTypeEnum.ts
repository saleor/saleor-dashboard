import { AttributeInputTypeEnum } from "@dashboard/graphql";

const attributeInputTypeValues = new Set<string>(Object.values(AttributeInputTypeEnum));

export const isAttributeInputTypeEnum = (value: string): value is AttributeInputTypeEnum =>
  attributeInputTypeValues.has(value);
