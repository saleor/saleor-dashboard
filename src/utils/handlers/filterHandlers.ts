import { IFilter, IFilterElement } from "@saleor/components/Filter";
import { UseNavigatorResult } from "@saleor/hooks/useNavigator";
import { Sort, Pagination, ActiveTab, Search } from "@saleor/types";
import { getFilterQueryParams } from "../filters";

type RequiredParams = ActiveTab & Search & Sort & Pagination;
type CreateUrl = (params: RequiredParams) => string;
type GetFilterQueryParam<
  TFilterKeys extends string,
  TFilters extends object
> = (filter: IFilterElement<TFilterKeys>) => TFilters;
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
  cleanupFn: () => void;
}): CreateFilterHandlers<TFilterKeys> {
  const { getFilterQueryParam, navigate, createUrl, params, cleanupFn } = opts;

  const changeFilters = (filter: IFilter<TFilterKeys>) => {
    cleanupFn();
    navigate(
      createUrl({
        ...params,
        ...getFilterQueryParams(filter, getFilterQueryParam),
        activeTab: undefined
      })
    );
  };

  const resetFilters = () => {
    cleanupFn();
    navigate(
      createUrl({
        asc: params.asc,
        sort: params.sort
      })
    );
  };

  const handleSearchChange = (query: string) => {
    cleanupFn();
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
