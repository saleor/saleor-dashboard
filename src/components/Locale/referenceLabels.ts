import { type FieldReadFunction, makeVar, type TypePolicies } from "@apollo/client";

import { getFormattingLocale } from "./formattingLocale";

/**
 * The Dashboard language, mirrored for the GraphQL cache, which can't read React context.
 * LocaleProvider keeps it in sync; changing it re-renders every query that reads a label.
 */
export const referenceLabelsLocale = makeVar("en");

type ReferenceType = "region" | "language";

const displayNames = new Map<string, Intl.DisplayNames | null>();

const getDisplayNames = (locale: string, type: ReferenceType): Intl.DisplayNames | null => {
  const key = `${locale}:${type}`;

  if (!displayNames.has(key)) {
    try {
      displayNames.set(
        key,
        new Intl.DisplayNames(getFormattingLocale(locale), { type, fallback: "none" }),
      );
    } catch {
      displayNames.set(key, null);
    }
  }

  return displayNames.get(key) ?? null;
};

/**
 * Names a country or language code in the given Dashboard language. Keeps the fallback (the API's
 * English name) for English, and when the browser has no name for the code.
 */
export const getReferenceLabel = (
  type: ReferenceType,
  code: string,
  fallback: string,
  locale: string,
): string => {
  if (locale === "en" || !code) {
    return fallback;
  }

  try {
    const normalizedCode = type === "region" ? code.toUpperCase() : code.replace(/_/g, "-");

    return getDisplayNames(locale, type)?.of(normalizedCode) || fallback;
  } catch {
    // Invalid codes throw; keep the API's name.
    return fallback;
  }
};

const readReferenceLabel =
  (type: ReferenceType): FieldReadFunction<string> =>
  (existing, { readField }) => {
    const code = readField<string>("code");

    if (typeof existing !== "string" || !existing || !code) {
      return existing;
    }

    // Read-time only: the cached server value stays the API's English name.
    return getReferenceLabel(type, code, existing, referenceLabelsLocale());
  };

/**
 * Country and language names come from the API in English. These policies show them in the
 * Dashboard language without changing codes or anything users typed.
 */
export const referenceLabelTypePolicies: TypePolicies = {
  CountryDisplay: {
    keyFields: ["code"],
    fields: {
      country: { read: readReferenceLabel("region") },
    },
  },
  LanguageDisplay: {
    fields: {
      language: { read: readReferenceLabel("language") },
    },
  },
};
