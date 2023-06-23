export class FlagContent {
  constructor(public enabled: boolean, public value?: string) {}

  public static fromString(content: string) {
    try {
      const { enabled, value } = JSON.parse(content);

      return new FlagContent(enabled, value);
    } catch (e) {
      return FlagContent.empty();
    }
  }

  public static empty() {
    return new FlagContent(false, "");
  }

  public asString() {
    return JSON.stringify(this);
  }
}
