import useNavigator from "@dashboard/hooks/useNavigator";
import {
  buildTranslationDetailQueryString,
  getActiveFieldsFromParams,
  type TranslationDetailQueryParams,
} from "@dashboard/translations/translationQueryParams";
import { useCallback } from "react";

export function useTranslationDetailNavigation(params: TranslationDetailQueryParams = {}) {
  const navigate = useNavigator();

  const navigateToQuery = useCallback(
    (nextParams: TranslationDetailQueryParams) => {
      const queryString = buildTranslationDetailQueryString(nextParams);

      navigate(queryString ? `?${queryString}` : "?", { replace: true });
    },
    [navigate],
  );

  const onEdit = useCallback(
    (field: string | string[]) => {
      navigateToQuery({
        activeField: field,
        bulk: params.bulk,
      });
    },
    [navigateToQuery, params.bulk],
  );

  const onDiscard = useCallback(
    (field?: string) => {
      if (!field) {
        navigateToQuery({ bulk: params.bulk });

        return;
      }

      const activeFields = getActiveFieldsFromParams(params);
      const newActiveFields = activeFields.filter(activeField => activeField !== field);

      navigateToQuery({
        activeField:
          newActiveFields.length === 0
            ? undefined
            : newActiveFields.length === 1
              ? newActiveFields[0]
              : newActiveFields,
        bulk: params.bulk,
      });
    },
    [navigateToQuery, params],
  );

  const onBulkChange = useCallback(
    (bulk: boolean) => {
      navigateToQuery({
        bulk,
      });
    },
    [navigateToQuery],
  );

  return {
    navigateToQuery,
    onBulkChange,
    onDiscard,
    onEdit,
  };
}
