/**
 * Schema version helper
 *
 * This module provides helpers to determine which GraphQL schema version is active.
 * The schema version is controlled by the FF_USE_UNSTABLE_SCHEMA feature flag.
 *
 * - When FF_USE_UNSTABLE_SCHEMA=true: Use unstable schema with Unstable suffixed types/hooks
 * - When FF_USE_UNSTABLE_SCHEMA=false (default): Use stable schema with base types/hooks
 */

export type SchemaVersion = "stable" | "unstable";

/**
 * Get the current schema version based on the FF_USE_UNSTABLE_SCHEMA feature flag
 */
export const getSchemaVersion = (): SchemaVersion => {
  // Flags is Vite-specific global, it's resolved build time from env variables
  return FLAGS["FF_USE_UNSTABLE_SCHEMA"] === "true" ? "unstable" : "stable";
};

/**
 * Check if unstable schema is currently active
 */
export const isUnstableSchema = (): boolean => {
  return getSchemaVersion() === "unstable";
};

/**
 * Check if stable schema is currently active
 */
export const isStableSchema = (): boolean => {
  return getSchemaVersion() === "stable";
};
