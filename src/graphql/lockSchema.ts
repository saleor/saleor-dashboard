import { removeDirectivesFromDocument } from "@apollo/client/utilities";
import { type DirectiveNode, type DocumentNode } from "graphql";

import { getSchemaVersion, type SchemaVersion } from "./schemaVersion";

const LOCK_SCHEMA_DIRECTIVE = "lockSchema";

const lockedTo = (directive: DirectiveNode): string | undefined => {
  const schemaArg = directive.arguments?.find(arg => arg.name.value === "schema");

  return schemaArg?.value.kind === "StringValue" ? schemaArg.value.value : undefined;
};

/**
 * Resolves `@lockSchema` for one schema version: fields locked to the other version are dropped,
 * and the directive is stripped off the fields that survive so it never reaches the API.
 *
 * Two passes because `removeDirectivesFromDocument` treats `remove: true` as a document-wide
 * flag — a single call with both configs would delete every `@lockSchema` field, not just the
 * locked-out ones.
 */
export const resolveLockedSchemaFields = (
  document: DocumentNode,
  activeSchema: SchemaVersion,
): DocumentNode => {
  const withoutLockedOutFields = removeDirectivesFromDocument(
    [
      {
        test: directive =>
          directive.name.value === LOCK_SCHEMA_DIRECTIVE && lockedTo(directive) !== activeSchema,
        remove: true,
      },
    ],
    document,
  );

  const resolved = removeDirectivesFromDocument(
    [{ name: LOCK_SCHEMA_DIRECTIVE }],
    withoutLockedOutFields ?? document,
  );

  return resolved ?? document;
};

export const resolveLockedSchemaFieldsForBuild = (document: DocumentNode): DocumentNode =>
  resolveLockedSchemaFields(document, getSchemaVersion());
