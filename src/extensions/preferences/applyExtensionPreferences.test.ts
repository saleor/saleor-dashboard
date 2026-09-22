import { applyExtensionPreferences } from "./applyExtensionPreferences";
import { type ResolvedPreferenceState } from "./types";

const ext = (id: string) => ({ id, identifier: id, app: { id: "app", identifier: "app" } });

describe("applyExtensionPreferences", () => {
  it("removes hidden extensions", () => {
    // Arrange
    const list = [ext("a"), ext("b"), ext("c")];
    const state: Record<string, ResolvedPreferenceState> = { "app:b": "hidden" };
    const getState = (e: { id: string }) => state[`app:${e.id}`] ?? "default";

    // Act
    const result = applyExtensionPreferences(list, getState);

    // Assert
    expect(result.map(e => e.id)).toEqual(["a", "c"]);
  });

  it("floats pinned extensions to the top, preserving relative order (stable)", () => {
    // Arrange
    const list = [ext("a"), ext("b"), ext("c"), ext("d")];
    const state: Record<string, ResolvedPreferenceState> = { "app:c": "pinned", "app:a": "pinned" };
    const getState = (e: { id: string }) => state[`app:${e.id}`] ?? "default";

    // Act
    const result = applyExtensionPreferences(list, getState);

    // Assert: pinned block keeps input order [a, c], then rest [b, d]
    expect(result.map(e => e.id)).toEqual(["a", "c", "b", "d"]);
  });

  it("removes hidden and pins in one pass", () => {
    // Arrange
    const list = [ext("a"), ext("b"), ext("c")];
    const state: Record<string, ResolvedPreferenceState> = { "app:c": "pinned", "app:b": "hidden" };
    const getState = (e: { id: string }) => state[`app:${e.id}`] ?? "default";

    // Act / Assert
    expect(applyExtensionPreferences(list, getState).map(e => e.id)).toEqual(["c", "a"]);
  });

  it("does not mutate the input array", () => {
    // Arrange
    const list = [ext("a"), ext("b")];

    // Act
    applyExtensionPreferences(list, () => "default");

    // Assert
    expect(list.map(e => e.id)).toEqual(["a", "b"]);
  });
});
