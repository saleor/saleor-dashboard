import { OpenPopupParams } from "@saleor/app-sdk/app-bridge";

import { type Extension } from "./types";

/**
 * Upper bound on the serialized payload length (chars). Sourced from the SDK so
 * the Dashboard rejects exactly what the app-side serializer refuses to emit.
 */
export const OPEN_POPUP_MAX_PARAMS_LENGTH = OpenPopupParams.maxParamsLength;

/**
 * Not a discriminated union on purpose: these helpers are consumed from
 * non-strict files where boolean-literal discriminants don't narrow, so callers
 * read the optional `reason` directly after checking `ok`.
 */
export interface ValidateOpenPopupParamsResult {
  ok: boolean;
  /** Failure description, set when `ok` is false. */
  reason?: string;
}

/**
 * Validate the app-supplied `appParams` before it goes into the popup URL. The
 * app already serialized it (base64) - the Dashboard doesn't decode it, only
 * guards its length so a malformed/huge value can't blow past the URL ceiling.
 */
export const validateOpenPopupParams = (appParams?: string): ValidateOpenPopupParamsResult => {
  if (appParams === undefined) {
    return { ok: true };
  }

  if (typeof appParams !== "string") {
    return { ok: false, reason: "appParams must be a string" };
  }

  if (appParams.length > OPEN_POPUP_MAX_PARAMS_LENGTH) {
    return {
      ok: false,
      reason: `appParams too large: ${appParams.length} chars (max ${OPEN_POPUP_MAX_PARAMS_LENGTH})`,
    };
  }

  return { ok: true };
};

/**
 * The subset of an extension needed to resolve and open a popup. Both
 * `Extension` and `ExtensionWithParams` satisfy it (the latter isn't assignable
 * to `Extension` because of its `open` signature).
 */
export type PopupCandidate = Pick<
  Extension,
  "id" | "app" | "identifier" | "targetName" | "url" | "label" | "accessToken" | "refetch"
>;

/**
 * Find the POPUP extension a widget is allowed to open: same app
 * (`requestingAppId`), matching `identifier`, and `target === "POPUP"`.
 *
 * Filtering by app id is what enforces the "same app only" rule - candidates
 * from other apps are never considered.
 */
export const findOpenPopupExtension = (
  extensions: PopupCandidate[],
  {
    requestingAppId,
    extensionIdentifier,
  }: { requestingAppId: string; extensionIdentifier: string },
): PopupCandidate | undefined =>
  extensions.find(
    extension =>
      extension.app.id === requestingAppId &&
      extension.identifier === extensionIdentifier &&
      extension.targetName === "POPUP",
  );
