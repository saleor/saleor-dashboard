import { type DirectiveNode, type DocumentNode, Kind, visit } from "graphql";

import { getSchemaVersion, type SchemaVersion } from "./schemaVersion";

const LOCK_SCHEMA_DIRECTIVE = "lockSchema";

const lockedTo = (directive: DirectiveNode): string | undefined => {
  const schemaArg = directive.arguments?.find(arg => arg.name.value === "schema");

  return schemaArg?.value.kind === "StringValue" ? schemaArg.value.value : undefined;
};

const locksOf = (node: { directives?: readonly DirectiveNode[] }): DirectiveNode[] =>
  node.directives?.filter(directive => directive.name.value === LOCK_SCHEMA_DIRECTIVE) ?? [];

const withoutLocks = <T extends { directives?: readonly DirectiveNode[] }>(
  node: T,
  locks: DirectiveNode[],
): T => ({ ...node, directives: node.directives?.filter(d => !locks.includes(d)) });

/**
 * True when the whole operation is locked to the other schema version — i.e. its root field does
 * not exist there at all. Nothing strips it at runtime (an operation cannot be removed from the
 * document it *is*); callers gate the entry points by hand and the validation sweep skips it.
 */
export const isOperationLockedOut = (
  document: DocumentNode,
  activeSchema: SchemaVersion,
): boolean =>
  document.definitions.some(
    definition =>
      definition.kind === Kind.OPERATION_DEFINITION &&
      locksOf(definition).some(lock => lockedTo(lock) !== activeSchema),
  );

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
        const locks = locksOf(node);

        if (!locks.length) {
          return undefined;
        }

        if (locks.some(lock => lockedTo(lock) !== activeSchema)) {
          return null;
        }

        return withoutLocks(node, locks);
      },
    },
    // An operation-level lock is a build-time marker only, but the directive still has to come
    // off — the API knows nothing about `@lockSchema`.
    OperationDefinition: {
      enter(node) {
        const locks = locksOf(node);

        return locks.length ? withoutLocks(node, locks) : undefined;
      },
    },
  });

export const resolveLockedSchemaFieldsForBuild = (document: DocumentNode): DocumentNode =>
  resolveLockedSchemaFields(document, getSchemaVersion());
