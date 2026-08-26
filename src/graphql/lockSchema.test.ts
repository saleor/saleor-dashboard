import * as generatedDocuments from "@dashboard/graphql/hooks.generated";
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
 * `exportGiftCards` was removed from `Mutation` in 3.24. `@lockSchema` cannot express this: the
 * mutation is the operation's only root field, so stripping it leaves an empty selection set, and
 * `$input: ExportGiftCardsInput!` is a variable definition the directive cannot reach.
 *
 * Every entry point is gated behind `isMainSchema()`, so the document is unreachable on 3.24 —
 * but it is still generated, hence this entry. Delete it once the document itself goes.
 */
const KNOWN_324_GAPS = ["ExportGiftCardsDocument"];

const ATTRIBUTE_DOCUMENT = "AttributeDetailsDocument";

const isDocumentNode = (value: unknown): value is DocumentNode =>
  typeof value === "object" && value !== null && (value as DocumentNode).kind === "Document";

const ALL_DOCUMENTS: Array<[string, DocumentNode]> = Object.entries(generatedDocuments)
  .filter(
    ([name, value]) =>
      name.endsWith("Document") && !KNOWN_324_GAPS.includes(name) && isDocumentNode(value),
  )
  .map(([name, value]) => [name, value as DocumentNode]);

const loadSchema = (file: string): GraphQLSchema =>
  buildSchema(fs.readFileSync(path.join(process.cwd(), file), "utf8"), { assumeValidSDL: true });

/**
 * Both schemas are the ones the app is actually built against, loaded *without*
 * `schema-directives.graphql` — so a `@lockSchema` that survived resolution fails here as an
 * unknown directive, exactly as the API would reject it.
 */
const validateAgainst = (schema: GraphQLSchema, document: DocumentNode): string[] =>
  // Re-parsing catches selection sets emptied by the strip, which `validate` accepts but the API
  // rejects as a syntax error.
  validate(schema, parse(print(document))).map(error => error.message);

describe("resolveLockedSchemaFields", () => {
  it.each([
    ["main", "schema-main.graphql"],
    ["staging", "schema-staging.graphql"],
  ] as const)("leaves every generated document valid on the %s schema", (activeSchema, file) => {
    // Arrange
    const schema = loadSchema(file);

    // Act
    const broken = ALL_DOCUMENTS.map(([name, document]): [string, string[]] => [
      name,
      validateAgainst(schema, resolveLockedSchemaFields(document, activeSchema)),
    ]).filter(([, errors]) => errors.length > 0);

    // Assert
    expect(Object.fromEntries(broken)).toEqual({});
  });

  it("keeps fields locked to the active schema", () => {
    // Arrange / Act
    const resolved = print(
      resolveLockedSchemaFields(generatedDocuments[ATTRIBUTE_DOCUMENT], "main"),
    );

    // Assert
    expect(resolved).toContain("availableInGrid");
    expect(resolved).toContain("filterableInStorefront");
    expect(resolved).toContain("storefrontSearchPosition");
    expect(resolved).not.toContain("@lockSchema");
  });

  it("drops fields locked to the other schema", () => {
    // Arrange / Act
    const resolved = print(
      resolveLockedSchemaFields(generatedDocuments[ATTRIBUTE_DOCUMENT], "staging"),
    );

    // Assert
    expect(resolved).not.toContain("availableInGrid");
    expect(resolved).not.toContain("filterableInStorefront");
    expect(resolved).not.toContain("storefrontSearchPosition");
    expect(resolved).not.toContain("@lockSchema");
  });
});

describe("apolloClient cache", () => {
  it("resolves @lockSchema before the cache and the link see the document", async () => {
    // Arrange — imported lazily so the client module is only evaluated for this assertion
    const { apolloClient } = await import("./client");

    // Act
    const transformed = print(
      apolloClient.cache.transformDocument(generatedDocuments[ATTRIBUTE_DOCUMENT]),
    );

    // Assert — jest runs with FLAGS = {}, i.e. the main schema
    expect(transformed).not.toContain("@lockSchema");
    expect(transformed).toContain("availableInGrid");
  });
});
