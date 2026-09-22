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

import { isOperationLockedOut, resolveLockedSchemaFields } from "./lockSchema";

const ATTRIBUTE_DOCUMENT = "AttributeDetailsDocument";

const isDocumentNode = (value: unknown): value is DocumentNode =>
  typeof value === "object" && value !== null && (value as DocumentNode).kind === "Document";

const ALL_DOCUMENTS: Array<[string, DocumentNode]> = Object.entries(generatedDocuments)
  .filter(([name, value]) => name.endsWith("Document") && isDocumentNode(value))
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

    // Act — operations whose root field is gone from this schema are excused; they carry an
    // operation-level `@lockSchema` and their entry points are gated by hand.
    const broken = ALL_DOCUMENTS.filter(
      ([, document]) => !isOperationLockedOut(document, activeSchema),
    )
      .map(([name, document]): [string, string[]] => [
        name,
        validateAgainst(schema, resolveLockedSchemaFields(document, activeSchema)),
      ])
      .filter(([, errors]) => errors.length > 0);

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

describe("operation-level @lockSchema", () => {
  // No shipped operation carries an operation-level lock right now — `exportGiftCards` was the
  // last one and it is gone from the app together with its UI. Kept inline so the behaviour stays
  // covered for whichever operation 3.24 removes next.
  const EXPORT_GIFT_CARDS = parse(`
    mutation ExportGiftCards($input: ExportGiftCardsInput!) @lockSchema(schema: "main") {
      exportGiftCards(input: $input) {
        exportFile {
          id
        }
      }
    }
  `);

  it("reports an operation locked to the other schema", () => {
    // Arrange / Act / Assert
    expect(isOperationLockedOut(EXPORT_GIFT_CARDS, "staging")).toBe(true);
    expect(isOperationLockedOut(EXPORT_GIFT_CARDS, "main")).toBe(false);
    expect(isOperationLockedOut(generatedDocuments[ATTRIBUTE_DOCUMENT], "staging")).toBe(false);
  });

  it("strips the directive so it never reaches the API", () => {
    // Arrange / Act / Assert — the operation itself stays; only the entry points are gated
    expect(print(resolveLockedSchemaFields(EXPORT_GIFT_CARDS, "main"))).not.toContain(
      "@lockSchema",
    );
    expect(
      validateAgainst(
        loadSchema("schema-main.graphql"),
        resolveLockedSchemaFields(EXPORT_GIFT_CARDS, "main"),
      ),
    ).toEqual([]);
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
