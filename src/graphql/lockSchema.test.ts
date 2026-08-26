import {
  AttributeDetailsDocument,
  AttributeListDocument,
  AttributeUpdateDocument,
  PageTypeAssignedAttributesForListDocument,
  ProductTypeAssignedAttributesForListDocument,
} from "@dashboard/graphql";
import fs from "fs";
import {
  buildSchema,
  type DocumentNode,
  type GraphQLSchema,
  parse,
  print,
  validate,
} from "graphql";
import path from "path";

import { resolveLockedSchemaFields } from "./lockSchema";

/**
 * The documents that carry `@lockSchema`. Both schemas are the real ones the app is built
 * against, loaded *without* `schema-directives.graphql`, so a directive that survived the strip
 * fails here as an unknown directive — exactly as the API would reject it.
 */
const LOCKED_DOCUMENTS: Array<[string, DocumentNode]> = [
  ["AttributeDetails", AttributeDetailsDocument],
  ["AttributeList", AttributeListDocument],
  ["AttributeUpdate", AttributeUpdateDocument],
  ["PageTypeAssignedAttributesForList", PageTypeAssignedAttributesForListDocument],
  ["ProductTypeAssignedAttributesForList", ProductTypeAssignedAttributesForListDocument],
];

const loadSchema = (file: string): GraphQLSchema =>
  buildSchema(fs.readFileSync(path.join(process.cwd(), file), "utf8"), {
    assumeValidSDL: true,
  });

describe("resolveLockedSchemaFields", () => {
  describe.each([
    ["main", "schema-main.graphql"],
    ["staging", "schema-staging.graphql"],
  ] as const)("against the %s schema", (activeSchema, schemaFile) => {
    const schema = loadSchema(schemaFile);

    it.each(LOCKED_DOCUMENTS)("%s resolves to a valid document", (_name, document) => {
      // Arrange / Act
      const resolved = resolveLockedSchemaFields(document, activeSchema);
      // Re-parsing catches selection sets emptied by the strip, which `validate` lets through
      // but the API rejects as a syntax error.
      const reparsed = parse(print(resolved));

      // Assert
      expect(validate(schema, reparsed).map(error => error.message)).toEqual([]);
    });
  });

  it("keeps fields locked to the active schema", () => {
    // Arrange / Act
    const resolved = print(resolveLockedSchemaFields(AttributeDetailsDocument, "main"));

    // Assert
    expect(resolved).toContain("availableInGrid");
    expect(resolved).toContain("filterableInStorefront");
    expect(resolved).toContain("storefrontSearchPosition");
    expect(resolved).not.toContain("@lockSchema");
  });

  it("drops fields locked to the other schema", () => {
    // Arrange / Act
    const resolved = print(resolveLockedSchemaFields(AttributeDetailsDocument, "staging"));

    // Assert
    expect(resolved).not.toContain("availableInGrid");
    expect(resolved).not.toContain("filterableInStorefront");
    expect(resolved).not.toContain("storefrontSearchPosition");
    expect(resolved).not.toContain("@lockSchema");
  });
});

describe("apolloClient cache", () => {
  it("resolves @lockSchema before the cache and the link see the document", async () => {
    // Arrange — importing lazily so the client module is only evaluated for this assertion
    const { apolloClient } = await import("./client");

    // Act
    const transformed = print(apolloClient.cache.transformDocument(AttributeDetailsDocument));

    // Assert — jest runs with FLAGS = {}, i.e. the main schema
    expect(transformed).not.toContain("@lockSchema");
    expect(transformed).toContain("availableInGrid");
  });
});
