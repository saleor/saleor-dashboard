import { IFilter } from "@saleor/components/Filter";
import { UseNavigatorResult } from "@saleor/hooks/useNavigator";
import { Sort, Pagination, ActiveTab, Search } from "@saleor/types";
import { getFilterQueryParams, GetFilterQueryParam } from "../filters";

type RequiredParams = ActiveTab & Search & Sort & Pagination;
type CreateUrl = (params: RequiredParams) => string;
type CreateFilterHandlers<TFilterKeys extends string> = [
  (filter: IFilter<TFilterKeys>) => void,
  () => void,
  (query: string) => void
];

function createFilterHandlers<
  TFilterKeys extends string,
  TFilters extends object
>(opts: {
  getFilterQueryParam: GetFilterQueryParam<TFilterKeys, TFilters>;
  navigate: UseNavigatorResult;
  createUrl: CreateUrl;
  params: RequiredParams;
  cleanupFn?: () => void;
}): CreateFilterHandlers<TFilterKeys> {
  const { getFilterQueryParam, navigate, createUrl, params, cleanupFn } = opts;

  const changeFilters = (filter: IFilter<TFilterKeys>) => {
    if (!!cleanupFn) {
      cleanupFn();
    }

    navigate(
      createUrl({
        ...params,
        ...getFilterQueryParams(filter, getFilterQueryParam),
        activeTab: undefined
      })
    );
  };

  const resetFilters = () => {
    if (!!cleanupFn) {
      cleanupFn();
    }

    navigate(
      createUrl({
        asc: params.asc,
        sort: params.sort
      })
    );
  };

  const handleSearchChange = (query: string) => {
    if (!!cleanupFn) {
      cleanupFn();
    }

    navigate(
      createUrl({
        ...params,
        activeTab: undefined,
        query
      })
    );
  };

  return [changeFilters, resetFilters, handleSearchChange];
}

export default createFilterHandlers;
