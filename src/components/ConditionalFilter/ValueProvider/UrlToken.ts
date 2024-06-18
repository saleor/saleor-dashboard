import { ParsedQs } from "qs";

import { getAttributeInputType } from "../constants";
import { ConditionSelected } from "../FilterElement/ConditionSelected";
import { slugFromConditionValue } from "../FilterElement/ConditionValue";

export const CONDITIONS = ["is", "equals", "in", "between", "lower", "greater"];

const ORDER_STATICS = [
  "paymentStatus",
  "status",
  "authorizeStatus",
  "chargeStatus",
  "giftCardBought",
  "giftCardUsed",
  "isPreorder",
  "isClickAndCollect",
  "channels",
  "customer",
  "ids",
];

const STATIC_TO_LOAD = [
  "category",
  "collection",
  "channel",
  "productType",
  "isAvailable",
  "isPublished",
  "isVisibleInListing",
  "hasCategory",
  "giftCard",
  ...ORDER_STATICS,
];

export const TokenType = {
  ATTRIBUTE_DROPDOWN: "o",
  ATTRIBUTE_MULTISELECT: "m",
  ATTRIBUTE_NUMERIC: "n",
  ATTRIBUTE_DATE_TIME: "t",
  ATTRIBUTE_DATE: "d",
  ATTRIBUTE_BOOLEAN: "b",
  STATIC: "s",
} as const;

export type TokenTypeValue = (typeof TokenType)[keyof typeof TokenType];

const resolveTokenType = (name: string): TokenTypeValue => {
  const key = `ATTRIBUTE_${name}` as keyof typeof TokenType;

  if (key in TokenType) {
    return TokenType[key];
  }

  return TokenType.STATIC;
};

export class UrlEntry {
  constructor(key: string, value: string | string[]) {
    (this as unknown as Record<string, string | string[]>)[key] = value;
  }

  public static fromQs(entry: ParsedQs) {
    const key = Object.keys(entry)[0];
    const value = entry[key] as string | string[];

    return new UrlEntry(key, value);
  }

  public static forAttribute(condition: ConditionSelected, paramName: string) {
    const inputType = getAttributeInputType(condition.conditionValue);
    const tokenSlug = resolveTokenType(inputType || "");

    return UrlEntry.fromConditionSelected(condition, paramName, tokenSlug);
  }

  public static forStatic(condition: ConditionSelected, paramName: string) {
    return UrlEntry.fromConditionSelected(condition, paramName, TokenType.STATIC);
  }

  public getInfo() {
    const [key, value] = Object.entries(this)[0] as [string, string | string[]];
    const [identifier, entryName] = key.split(".");
    const [type, control] = identifier.split("") as [TokenTypeValue, number];
    const conditionKid = CONDITIONS[control];

    return { key, value, entryName, type, conditionKid };
  }

  private static fromConditionSelected(
    condition: ConditionSelected,
    paramName: string,
    tokenSlug: TokenTypeValue,
  ) {
    const { conditionValue } = condition;
    const slug = slugFromConditionValue(condition.value);

    if (!conditionValue) {
      return new UrlEntry(tokenSlug, slug);
    }

    const conditionIndex = CONDITIONS.findIndex(el => el === conditionValue.label);

    return new UrlEntry(`${tokenSlug}${conditionIndex}.${paramName}`, slug);
  }
}

export class UrlToken {
  constructor(
    public name: string,
    public value: string | string[],
    public type: TokenTypeValue,
    public conditionKind: string,
  ) {}

  public static fromUrlEntry(entry: UrlEntry) {
    const { entryName, value, type, conditionKid } = entry.getInfo();

    return new UrlToken(entryName, value, type, conditionKid);
  }

  public isStatic() {
    return this.type === TokenType.STATIC;
  }

  public isAttribute() {
    const result = Object.entries(TokenType).find(([_, slug]) => slug === this.type);

    return result && result[0].includes("ATTRIBUTE");
  }

  public hasDynamicValues() {
    return (
      TokenType.ATTRIBUTE_DROPDOWN === this.type || TokenType.ATTRIBUTE_MULTISELECT === this.type
    );
  }

  public isLoadable() {
    return STATIC_TO_LOAD.includes(this.name) || this.isAttribute();
  }
}
