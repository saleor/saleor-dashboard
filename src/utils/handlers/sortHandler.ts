import { DEFAULT_INITIAL_PAGINATION_DATA } from "@dashboard/config";
import { UseNavigatorResult } from "@dashboard/hooks/useNavigator";
import { Sort } from "@dashboard/types";

import { getSortUrlVariables } from "../sort";

type CreateUrl<T extends string> = (params: Sort<T>) => string;

function createSortHandler<T extends string>(
  navigate: UseNavigatorResult,
  createUrl: CreateUrl<T>,
  params: Sort<T>,
) {
  return (field: T) =>
    navigate(
      createUrl({
        ...params,
        ...getSortUrlVariables(field, params),
        ...DEFAULT_INITIAL_PAGINATION_DATA,
      }),
      { replace: true },
    );
}

export default createSortHandler;
