import { getMultipleUrlValues, stringifyQs } from "@dashboard/utils/urls";

export interface TranslationDetailQueryParams {
  activeField?: string | string[];
  bulk?: boolean;
}

export function parseTranslationDetailQueryParams(
  qs: Record<string, unknown>,
  search = "",
): TranslationDetailQueryParams {
  const activeFieldsFromSearch = search
    ? getMultipleUrlValues(search.startsWith("?") ? search : `?${search}`, "activeField")
    : [];

  const activeFieldFromQuery = qs.activeField;

  const activeFields =
    activeFieldsFromSearch.length > 0
      ? activeFieldsFromSearch
      : typeof activeFieldFromQuery === "string"
        ? [activeFieldFromQuery]
        : Array.isArray(activeFieldFromQuery)
          ? activeFieldFromQuery.filter((value): value is string => typeof value === "string")
          : [];

  return {
    activeField:
      activeFields.length === 0
        ? undefined
        : activeFields.length === 1
          ? activeFields[0]
          : activeFields,
    bulk: qs.bulk === "1" || qs.bulk === true,
  };
}

export function getActiveFieldsFromParams(params: TranslationDetailQueryParams): string[] {
  if (!params.activeField) {
    return [];
  }

  return Array.isArray(params.activeField) ? params.activeField : [params.activeField];
}

export function buildTranslationDetailQueryString(params: TranslationDetailQueryParams): string {
  const query: Record<string, string | string[]> = {};

  if (params.activeField) {
    query.activeField = params.activeField;
  }

  if (params.bulk) {
    query.bulk = "1";
  }

  return stringifyQs(query, Array.isArray(params.activeField) ? "repeat" : undefined);
}
