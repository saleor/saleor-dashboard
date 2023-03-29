import { IFilter } from "@dashboard/components/Filter";
import { UseNavigatorResult } from "@dashboard/hooks/useNavigator";
import { ActiveTab, Pagination, Search, Sort } from "@dashboard/types";

import { GetFilterQueryParam, getFilterQueryParams } from "../filters";

type RequiredParams = ActiveTab &
  Search &
  Sort<any> &
  Pagination & { presestesChanged?: string };
type CreateUrl = (params: RequiredParams) => string;
type CreateFilterHandlers<TFilterKeys extends string> = [
  (filter: IFilter<TFilterKeys>) => void,
  () => void,
  (query: string) => void,
];

function createFilterHandlers<
  TFilterKeys extends string,
  TFilters extends {},
>(opts: {
  getFilterQueryParam: GetFilterQueryParam<TFilterKeys, TFilters>;
  navigate: UseNavigatorResult;
  createUrl: CreateUrl;
  params: RequiredParams;
  cleanupFn?: () => void;
  keepActiveTab?: boolean;
}): CreateFilterHandlers<TFilterKeys> {
  const {
    getFilterQueryParam,
    navigate,
    createUrl,
    params,
    cleanupFn,
    keepActiveTab,
  } = opts;

  const changeFilters = (filters: IFilter<TFilterKeys>) => {
    if (!!cleanupFn) {
      cleanupFn();
    }

    navigate(
      createUrl({
        ...params,
        ...getFilterQueryParams(filters, getFilterQueryParam),
        ...(!keepActiveTab && { activeTab: undefined }),
        presestesChanged: "true",
      }),
    );
  };

  const resetFilters = () => {
    if (!!cleanupFn) {
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
    if (!!cleanupFn) {
      cleanupFn();
    }

    navigate(
      createUrl({
        ...params,
        after: undefined,
        before: undefined,
        ...(!keepActiveTab && { activeTab: undefined }),
        query: query?.trim(),
        presestesChanged: "true",
      }),
    );
  };

  return [changeFilters, resetFilters, handleSearchChange];
}

export default createFilterHandlers;
