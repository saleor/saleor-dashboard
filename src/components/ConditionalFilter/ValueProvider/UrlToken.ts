import { ParsedQs } from "qs";

import { ConditionSelected } from "../FilterElement/ConditionSelected";
import { slugFromConditionValue } from "../FilterElement/ConditionValue";

export const CONDITIONS = ["is", "equals", "in", "between", "lower", "greater"];

const STATIC_TO_LOAD = ["category", "collection", "channel", "producttype"];

export const TokenType = {
  ATTRIBUTE: "a",
  STATIC: "s"
} as const

export type TokenTypeValue = (typeof TokenType)[keyof typeof TokenType]


export class UrlEntry {
  constructor(key: string, value: string | string[]) {
    (this as unknown as Record<string, string | string[]>)[key] = value;
  }

  public static fromQs(entry: ParsedQs) {
    const key = Object.keys(entry)[0]
    const value = entry[key] as string | string[]

    return new UrlEntry(key, value)
  }

  public static forAttribute (condition: ConditionSelected, paramName: string) {
    return UrlEntry.fromConditionSelected(condition, paramName, TokenType.ATTRIBUTE)
  }

  public static forStatic (condition: ConditionSelected, paramName: string) {
    return UrlEntry.fromConditionSelected(condition, paramName, TokenType.STATIC)
  }

  public getInfo () {
    const [key, value] = Object.entries(this)[0] as [
      string,
      string | string[],
    ];
    const [identifier, entryName] = key.split(".");
    const [type, control] = identifier.split("") as [TokenTypeValue, number];
    const conditionKid = CONDITIONS[control]

    return { key, value, entryName, type, conditionKid }
  }

  private static fromConditionSelected (
    condition: ConditionSelected,
    paramName: string,
    tokenSlug: TokenTypeValue
  ) {
    const { conditionValue } = condition;
    const conditionIndex = CONDITIONS.findIndex(
      el => conditionValue && el === conditionValue.label,
    );
    
    return new UrlEntry(
      `${tokenSlug}${conditionIndex}.${paramName}`,
      slugFromConditionValue(condition.value)
    )
  }
}

export class UrlToken {
  private constructor(
    public name: string,
    public value: string | string[],
    public type: TokenTypeValue,
    public conditionKind: string,
  ) {}

  public static fromUrlEntry(entry: UrlEntry) {
    const {
      entryName,
      value,
      type,
      conditionKid
    } = entry.getInfo()

    return new UrlToken(entryName, value, type, conditionKid);
  }

  public isStatic() {
    return this.type === TokenType.STATIC;
  }

  public isAttribute() {
    return this.type === TokenType.ATTRIBUTE;
  }

  public isLoadable() {
    return STATIC_TO_LOAD.includes(this.name) || this.isAttribute();
  }
}
