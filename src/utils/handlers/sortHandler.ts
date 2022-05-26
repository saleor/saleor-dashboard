import { DEFAULT_INITIAL_PAGINATION_DATA } from "@saleor/config";
import { UseNavigatorResult } from "@saleor/hooks/useNavigator";
import { Sort } from "@saleor/types";

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
