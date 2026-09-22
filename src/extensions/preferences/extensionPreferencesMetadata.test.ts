import {
  parseExtensionPreferences,
  serializeExtensionPreferences,
  setPreferenceInMap,
} from "./extensionPreferencesMetadata";
import { type ExtensionPreferencesMap } from "./types";

describe("parseExtensionPreferences", () => {
  it("returns an empty map for undefined / empty input", () => {
    expect(parseExtensionPreferences(undefined)).toEqual({});
    expect(parseExtensionPreferences("")).toEqual({});
    expect(parseExtensionPreferences("{}")).toEqual({});
  });

  it("returns an empty map for malformed JSON without throwing", () => {
    expect(parseExtensionPreferences("not json")).toEqual({});
  });

  it("parses valid entries and drops entries with invalid state values", () => {
    // Arrange
    const raw = JSON.stringify({ "a:1": "pinned", "b:2": "hidden", "c:3": "bogus" });

    // Act / Assert
    expect(parseExtensionPreferences(raw)).toEqual({ "a:1": "pinned", "b:2": "hidden" });
  });
});

describe("setPreferenceInMap", () => {
  it("adds a pinned entry", () => {
    expect(setPreferenceInMap({}, "a:1", "pinned")).toEqual({ "a:1": "pinned" });
  });

  it("overwrites an existing entry (mutually exclusive)", () => {
    const map: ExtensionPreferencesMap = { "a:1": "pinned" };

    expect(setPreferenceInMap(map, "a:1", "hidden")).toEqual({ "a:1": "hidden" });
  });

  it("deletes the entry when set to default", () => {
    const map: ExtensionPreferencesMap = { "a:1": "pinned", "b:2": "hidden" };

    expect(setPreferenceInMap(map, "a:1", "default")).toEqual({ "b:2": "hidden" });
  });

  it("does not mutate the input map", () => {
    // Arrange
    const map: ExtensionPreferencesMap = { "a:1": "pinned" };

    // Act
    setPreferenceInMap(map, "a:1", "hidden");

    // Assert
    expect(map).toEqual({ "a:1": "pinned" });
  });
});

describe("serializeExtensionPreferences", () => {
  it("serializes an empty map to '{}'", () => {
    expect(serializeExtensionPreferences({})).toBe("{}");
  });

  it("round-trips through parse", () => {
    const map: ExtensionPreferencesMap = { "a:1": "pinned" };

    expect(parseExtensionPreferences(serializeExtensionPreferences(map))).toEqual(map);
  });
});
