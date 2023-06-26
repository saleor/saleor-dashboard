import { FlagContent } from "./FlagContent";

describe("featureFlags/FlagContent", () => {
  it("creates from string", async () => {
    // ARRANGE
    const stringValue = `{ "enabled": true, "value": "test" }`;

    // ACT
    const instance = FlagContent.fromString(stringValue);

    // ASSERT
    expect(instance).toEqual({ enabled: true, value: "test" });
  });

  it("creates empty", async () => {
    // ACT
    const instance = FlagContent.empty();

    // ASSERT
    expect(instance).toEqual({ enabled: false, value: "" });
  });

  it("returns a JSON string", async () => {
    // ARRANGE
    const instance = new FlagContent(true, "some value");

    const jsonString = instance.asString();

    expect(jsonString).toEqual('{"enabled":true,"value":"some value"}');
  });
});
