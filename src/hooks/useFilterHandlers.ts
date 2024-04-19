// @ts-strict-ignore
import { IFilter } from "@dashboard/components/Filter";
import { ActiveTab, Pagination, Search, Sort } from "@dashboard/types";
import { GetFilterQueryParam, getFilterQueryParams } from "@dashboard/utils/filters";
import { useEffect, useRef } from "react";

import useNavigator from "./useNavigator";

type RequiredParams = ActiveTab & Search & Sort<any> & Pagination & { presestesChanged?: string };
type CreateUrl = (params: RequiredParams) => string;
type CreateFilterHandlers<TFilterKeys extends string> = [
  (filter: IFilter<TFilterKeys>) => void,
  () => void,
  (query: string) => void,
];

export const useFilterHandlers = <
  TFilterKeys extends string,
  TFilters extends {},
  SortField extends string,
>(opts: {
  getFilterQueryParam: GetFilterQueryParam<TFilterKeys, TFilters>;
  createUrl: CreateUrl;
  params: RequiredParams;
  cleanupFn?: () => void;
  keepActiveTab?: boolean;
  defaultSortField: SortField;
  hasSortWithRank?: boolean;
}): CreateFilterHandlers<TFilterKeys> => {
  const {
    getFilterQueryParam,
    createUrl,
    params,
    cleanupFn,
    keepActiveTab,
    defaultSortField,
    hasSortWithRank = false,
  } = opts;
  const navigate = useNavigator();
  const prevAsc = useRef<boolean | null>(null);

  useEffect(() => {
    const hasQuery = !!params.query?.trim();
    if (hasQuery || params.sort === "rank") {
      prevAsc.current = params.asc;
    }
  }, [params.asc, params.query, params.sort]);

  const getActiveTabValue = (removeActiveTab: boolean) => {
    if (!keepActiveTab || removeActiveTab) {
      return undefined;
    }

    return params.activeTab;
  };
  const changeFilters = (filters: IFilter<TFilterKeys>) => {
    if (cleanupFn) {
      cleanupFn();
    }
    const filtersQueryParams = getFilterQueryParams(filters, getFilterQueryParam);
    navigate(
      createUrl({
        ...params,
        ...filtersQueryParams,
        activeTab: getActiveTabValue(
          checkIfParamsEmpty(filtersQueryParams) && !params.query?.length,
        ),
      }),
    );
  };
  const resetFilters = () => {
    if (cleanupFn) {
      cleanupFn();
    }

    navigate(
      createUrl({
        asc: params.asc,
        sort: params.sort,
      }),
    );
  };
  const handleSearchChange = (query: string) => {
    if (cleanupFn) {
      cleanupFn();
    }
    const trimmedQuery = query?.trim() ?? "";
    const hasQuery = !!trimmedQuery;
    const sortWithoutQuery = params.sort === "rank" ? defaultSortField : params.sort;
    const sortWithQuery = "rank" as SortField;
    const getAscParam = () => {
      if (hasQuery) {
        return false;
      }

      if (prevAsc !== null) {
        return true;
      }

      return params.asc;
    };

    navigate(
      createUrl({
        ...params,
        after: undefined,
        before: undefined,
        activeTab: getActiveTabValue(checkIfParamsEmpty(params) && !hasQuery),
        query: hasQuery ? trimmedQuery : undefined,
        ...(hasSortWithRank && {
          sort: hasQuery ? sortWithQuery : sortWithoutQuery,
          asc: getAscParam(),
        }),
      }),
    );
  };

  return [changeFilters, resetFilters, handleSearchChange];
};

function checkIfParamsEmpty(params: RequiredParams): boolean {
  const paramsToOmit = ["activeTab", "sort", "asc", "query"];

  return Object.entries(params)
    .filter(([name]) => !paramsToOmit.includes(name))
    .every(([_, value]) => value === undefined);
}
