import { type PluginErrorFragment } from "@dashboard/graphql";

import { isSmtpFieldName } from "./emailNotificationConfig";

export interface SmtpPluginErrorState {
  /** Per-field messages from the API (or client), keyed by configuration name. */
  fieldErrors: Record<string, string>;
  /**
   * When Saleor can’t open an SMTP session it attaches the same message to every
   * config key — surface once instead of repeating on each input.
   */
  connectionError: string | null;
}

const CONNECTION_ERROR_HINT = "unable to connect";

/**
 * Map `pluginUpdate` PluginErrors onto SMTP fields / a single connection callout.
 * Prefer the API `message` (e.g. “Missing sender address value.”) over generic codes.
 */
export const mapPluginErrorsToSmtpState = (
  errors: Array<Pick<PluginErrorFragment, "field" | "message" | "code">>,
): SmtpPluginErrorState => {
  const smtpErrors = errors.filter(
    (error): error is typeof error & { field: string } =>
      !!error.field && isSmtpFieldName(error.field),
  );

  if (smtpErrors.length === 0) {
    return { fieldErrors: {}, connectionError: null };
  }

  const firstMessage = smtpErrors[0].message?.trim() ?? "";
  const allSameMessage =
    firstMessage.length > 0 &&
    smtpErrors.every(error => (error.message?.trim() ?? "") === firstMessage);
  const looksLikeConnectionFailure =
    smtpErrors.length >= 3 &&
    allSameMessage &&
    firstMessage.toLowerCase().includes(CONNECTION_ERROR_HINT);

  if (looksLikeConnectionFailure) {
    return {
      fieldErrors: {},
      connectionError: firstMessage,
    };
  }

  const fieldErrors: Record<string, string> = {};

  for (const error of smtpErrors) {
    const text = error.message?.trim();

    if (!text) {
      continue;
    }

    // First message wins per field (Saleor usually sends one).
    if (!fieldErrors[error.field]) {
      fieldErrors[error.field] = text;
    }
  }

  return { fieldErrors, connectionError: null };
};

/** Prefer a non-SMTP API message (e.g. broken Handlebars template) for toast detail. */
export const getNonSmtpPluginErrorMessage = (
  errors: Array<Pick<PluginErrorFragment, "field" | "message">>,
): string | null => {
  for (const error of errors) {
    const text = error.message?.trim();

    if (!text) {
      continue;
    }

    if (!error.field || !isSmtpFieldName(error.field)) {
      return text;
    }
  }

  return null;
};
