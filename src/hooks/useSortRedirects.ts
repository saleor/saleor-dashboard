import useNavigator from "@dashboard/hooks/useNavigator";
import { Sort } from "@dashboard/types";
import { useEffect } from "react";

export type SortByRankUrlQueryParams<T extends string> = Sort<T> & {
  query?: string;
};

export interface UseSortRedirectsOpts<SortField extends string> {
  params: SortByRankUrlQueryParams<SortField>;
  defaultSortField: SortField;
  urlFunc: (params: SortByRankUrlQueryParams<SortField>) => string;
  resetToDefault?: boolean;
}
/**
 * useSortRedirects is a hook that should be used in lists views
 * where using search changes the sort field to "rank". Removing
 * query changes sort field back to default one provided in params.
 */
export function useSortRedirects<SortField extends string>({
  params,
  defaultSortField,
  urlFunc,
  resetToDefault,
}: UseSortRedirectsOpts<SortField>) {
  const navigate = useNavigator();

  const hasQuery = !!params.query?.trim();

  useEffect(() => {
    const sortWithQuery = "rank" as SortField;
    const sortWithoutQuery =
      params.sort === "rank" ? defaultSortField : params.sort;
    navigate(
      urlFunc({
        ...params,
        asc: hasQuery ? false : params.asc,
        sort: hasQuery ? sortWithQuery : sortWithoutQuery,
      }),
      { replace: true },
    );
  }, [params.query]);

  useEffect(() => {
    if (resetToDefault) {
      navigate(
        urlFunc({
          ...params,
          sort: defaultSortField,
        }),
        { replace: true },
      );
    }
  }, [params]);
}
