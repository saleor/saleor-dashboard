import { type DirectiveNode, type DocumentNode, visit } from "graphql";

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
 * Deliberately a plain `graphql` visitor rather than Apollo's `removeDirectivesFromDocument`,
 * which treats `remove: true` as a document-wide flag (so it cannot both keep and drop
 * `@lockSchema` fields in one pass) and throws on the multi-fragment document files codegen
 * hands it.
 */
export const resolveLockedSchemaFields = (
  document: DocumentNode,
  activeSchema: SchemaVersion,
): DocumentNode =>
  visit(document, {
    Field: {
      enter(node) {
        const locks = node.directives?.filter(
          directive => directive.name.value === LOCK_SCHEMA_DIRECTIVE,
        );

        if (!locks?.length) {
          return undefined;
        }

        if (locks.some(lock => lockedTo(lock) !== activeSchema)) {
          return null;
        }

        return {
          ...node,
          directives: node.directives?.filter(directive => !locks.includes(directive)),
        };
      },
    },
  });

export const resolveLockedSchemaFieldsForBuild = (document: DocumentNode): DocumentNode =>
  resolveLockedSchemaFields(document, getSchemaVersion());
