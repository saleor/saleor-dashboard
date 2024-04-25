import { FlagValue } from "./FlagContent";

describe("featureFlags/FlagValue", () => {
  it("creates from string", async () => {
    // Arrange
    const stringValue = `{ "enabled": true, "payload": "test" }`;
    // Act
    const instance = FlagValue.fromString(stringValue);

    // Assert
    expect(instance).toEqual({ enabled: true, payload: "test" });
  });
  it("creates empty", async () => {
    // Act
    const instance = FlagValue.empty();

    // Arrange
    expect(instance).toEqual({ enabled: false, payload: "" });
  });
  it("returns a JSON string", async () => {
    // Arrange
    const instance = new FlagValue(true, "some value");
    const jsonString = instance.asString();

    expect(jsonString).toEqual('{"enabled":true,"payload":"some value"}');
  });
});
