import { ExtensionsPaths } from "@dashboard/extensions/urls";
import { staffMemberDetailsUrl } from "@dashboard/staff/urls";

import { Actor } from "./types";

/**
 * Safely stringify an object for display, handling circular references
 * and removing __typename fields.
 */
export const safeStringify = (data: unknown): string => {
  if (data === null || data === undefined) return "";

  const seen = new WeakSet();

  return JSON.stringify(
    data,
    (key, value) => {
      if (key === "__typename") return undefined;

      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) return "[Circular]";

        seen.add(value);
      }

      return value;
    },
    2,
  );
};

/**
 * Converts separate user/app objects (from GraphQL) into a unified Actor type.
 * Returns undefined if neither user nor app is provided.
 */
export const toActor = (
  user: { id: string; email: string; firstName?: string; lastName?: string } | null | undefined,
  app: { id: string; name?: string | null } | null | undefined,
): Actor | undefined => {
  if (user) {
    return {
      type: "user",
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  if (app) {
    return {
      type: "app",
      id: app.id,
      name: app.name,
    };
  }

  return undefined;
};

/**
 * Returns a display name for the actor (user's full name/email or app's name).
 */
export const getActorDisplayName = (actor: Actor | undefined): string | undefined => {
  if (!actor) return undefined;

  if (actor.type === "user") {
    const { firstName, lastName, email } = actor;

    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }

    return email;
  }

  return actor.name ?? undefined;
};

/**
 * Returns the URL to the actor's detail page (staff member or app extension).
 */
export const getActorLink = (actor: Actor | undefined): string | null => {
  if (!actor) return null;

  if (actor.type === "user") {
    return staffMemberDetailsUrl(actor.id);
  }

  return ExtensionsPaths.resolveViewManifestExtension(encodeURIComponent(actor.id));
};
