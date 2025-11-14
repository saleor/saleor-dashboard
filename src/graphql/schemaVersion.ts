/**
 * Schema version helper
 *
 * This module provides helpers to determine which GraphQL schema version is active.
 * The schema version is controlled by the FF_USE_SCHEMA_323 feature flag.
 *
 * - When FF_USE_SCHEMA_323=true: Use staging schema (3.23) with V323 suffixed types/hooks
 * - When FF_USE_SCHEMA_323=false (default): Use production schema (3.22) with base types/hooks
 */

export type SchemaVersion = "322" | "323";

/**
 * Get the current schema version based on the FF_USE_SCHEMA_323 feature flag
 */
export const getSchemaVersion = (): SchemaVersion => {
  return FLAGS["FF_USE_SCHEMA_323"] === "true" ? "323" : "322";
};

/**
 * Check if schema 3.23 is currently active
 */
export const isSchema323 = (): boolean => {
  return getSchemaVersion() === "323";
};

/**
 * Check if schema 3.22 is currently active
 */
export const isSchema322 = (): boolean => {
  return getSchemaVersion() === "322";
};
