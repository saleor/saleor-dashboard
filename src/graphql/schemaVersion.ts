/**
 * Schema version helper
 *
 * This module provides helpers to determine which GraphQL schema version is active.
 * The schema version is controlled by the FF_USE_STAGING_SCHEMA feature flag.
 *
 * - When FF_USE_STAGING_SCHEMA=true: Use staging schema with Staging suffixed types/hooks
 * - When FF_USE_STAGING_SCHEMA=false (default): Use main schema with base types/hooks
 */

export type SchemaVersion = "main" | "staging";

/**
 * Get the current schema version based on the FF_USE_STAGING_SCHEMA feature flag
 */
export const getSchemaVersion = (): SchemaVersion => {
  return FLAGS["FF_USE_STAGING_SCHEMA"] === "true" ? "staging" : "main";
};

/**
 * Check if staging schema is currently active
 */
export const isStagingSchema = (): boolean => {
  return getSchemaVersion() === "staging";
};

/**
 * Check if main schema is currently active
 */
export const isMainSchema = (): boolean => {
  return getSchemaVersion() === "main";
};
