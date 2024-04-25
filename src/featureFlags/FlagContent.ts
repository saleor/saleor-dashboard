export class FlagValue {
  constructor(
    public enabled: boolean,
    public payload?: string,
  ) {}

  public static fromString(value: string) {
    try {
      const { enabled, payload } = JSON.parse(value);

      return new FlagValue(enabled, payload);
    } catch (e) {
      return FlagValue.empty();
    }
  }

  public static empty() {
    return new FlagValue(false, "");
  }

  public asString() {
    return JSON.stringify(this);
  }
}
