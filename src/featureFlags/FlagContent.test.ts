import { FlagValue } from "./FlagContent";

describe("featureFlags/FlagValue", () => {
  it("creates from string", async () => {
    // ARRANGE
    const stringValue = `{ "enabled": true, "payload": "test" }`;

    // ACT
    const instance = FlagValue.fromString(stringValue);

    // ASSERT
    expect(instance).toEqual({ enabled: true, payload: "test" });
  });

  it("creates empty", async () => {
    // ACT
    const instance = FlagValue.empty();

    // ASSERT
    expect(instance).toEqual({ enabled: false, payload: "" });
  });

  it("returns a JSON string", async () => {
    // ARRANGE
    const instance = new FlagValue(true, "some value");

    const jsonString = instance.asString();

    expect(jsonString).toEqual('{"enabled":true,"payload":"some value"}');
  });
});
