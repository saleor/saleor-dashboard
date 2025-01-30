import { UseNavigatorResult } from "@dashboard/hooks/useNavigator";
import { ActiveTab, Pagination, Search, Sort } from "@dashboard/types";

type RequiredParams = ActiveTab & Search & Sort<any> & Pagination & { presestesChanged?: string };
type CreateUrl = (params: RequiredParams) => string;
type CreateFilterHandlers = [() => void, (query: string) => void];

function createFilterHandlers(opts: {
  navigate: UseNavigatorResult;
  createUrl: CreateUrl;
  params: RequiredParams;
  cleanupFn?: () => void;
  keepActiveTab?: boolean;
}): CreateFilterHandlers {
  const { navigate, createUrl, params, cleanupFn, keepActiveTab } = opts;
  const getActiveTabValue = (removeActiveTab: boolean) => {
    if (!keepActiveTab || removeActiveTab) {
      return undefined;
    }

    return params.activeTab;
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

    navigate(
      createUrl({
        ...params,
        after: undefined,
        before: undefined,
        activeTab: getActiveTabValue(checkIfParamsEmpty(params) && trimmedQuery === ""),
        query: trimmedQuery !== "" ? trimmedQuery : undefined,
      }),
    );
  };

  return [resetFilters, handleSearchChange];
}

function checkIfParamsEmpty(params: RequiredParams): boolean {
  const paramsToOmit = ["activeTab", "sort", "asc", "query"];

  return Object.entries(params)
    .filter(([name]) => !paramsToOmit.includes(name))
    .every(([_, value]) => value === undefined);
}

export default createFilterHandlers;
