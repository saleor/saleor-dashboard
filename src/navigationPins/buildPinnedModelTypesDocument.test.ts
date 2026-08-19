import { print } from "graphql";

import {
  buildPinnedModelTypesDocument,
  buildPinnedModelTypesVariables,
} from "./buildPinnedModelTypesDocument";

describe("buildPinnedModelTypesDocument", () => {
  it("builds one aliased lookup per id, with ids as variables", () => {
    // Act
    const printed = print(buildPinnedModelTypesDocument(["type-a", "type-b"]));

    // Assert — this exact shape was verified against a live API: a missing type nulls only
    // its own alias instead of failing the whole query.
    expect(printed).toMatchInlineSnapshot(`
      "query PinnedModelTypes($pin0: ID!, $pin1: ID!) {
        pin0: pageType(id: $pin0) {
          ...PinnedModelType
        }
        pin1: pageType(id: $pin1) {
          ...PinnedModelType
        }
      }

      fragment PinnedModelType on PageType {
        id
        name
      }"
    `);
  });

  it("never interpolates ids into the document text", () => {
    // Act
    const printed = print(buildPinnedModelTypesDocument(['injected") { id } #']));

    // Assert
    expect(printed).not.toContain("injected");
  });

  it("maps each id onto its alias", () => {
    // Act
    const variables = buildPinnedModelTypesVariables(["type-a", "type-b"]);

    // Assert
    expect(variables).toEqual({ pin0: "type-a", pin1: "type-b" });
  });

  it("stays a valid document when there is nothing to fetch", () => {
    // Act
    const printed = print(buildPinnedModelTypesDocument([]));

    // Assert
    expect(printed).toContain("query PinnedModelTypes");
    expect(printed).not.toContain("pageType");
  });
});
