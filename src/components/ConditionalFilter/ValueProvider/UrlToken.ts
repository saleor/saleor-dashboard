// @ts-strict-ignore

export const CONDITIONS = ["is", "equals", "in", "between", "lower", "greater"];

const STATIC_TO_LOAD = ["category", "collection", "channel", "producttype"];

type TokenType = "a" | "s";

// export type UrlEntry = Record<string, string | string[]>

export class UrlEntry {
  constructor(key: string, value: string | string[]) {
    this[key] = value;
  }
}

export class UrlToken {
  private constructor(
    public name: string,
    public value: string | string[],
    public type: TokenType,
    public conditionKind: string,
  ) {}

  public static fromUrlEntry(entry: UrlEntry) {
    const [key, value] = Object.entries(entry)[0] as [
      string,
      string | string[],
    ];
    const [identifier, entryName] = key.split(".");
    const [type, control] = identifier.split("") as [TokenType, string];

    return new UrlToken(entryName, value, type, CONDITIONS[control]);
  }

  public isStatic() {
    return this.type === "s";
  }

  public isAttribute() {
    return this.type === "a";
  }

  public isLoadable() {
    return STATIC_TO_LOAD.includes(this.name) || this.isAttribute();
  }
}
