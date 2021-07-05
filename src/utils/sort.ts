import { findValueInEnum, parseBoolean } from "@saleor/misc";

import { TableCellHeaderArrowDirection } from "../components/TableCellHeader";
import { Sort } from "../types";
import { OrderDirection } from "../types/globalTypes";

export function getSortUrlVariables<TSortKey extends string>(
  field: TSortKey,
  params: Sort<TSortKey>
): Sort<TSortKey> {
  if (field === params.sort) {
    return {
      asc: !params.asc,
      sort: field
    };
  }

  return {
    asc: true,
    sort: field
  };
}

export function getOrderDirection(asc: boolean): OrderDirection {
  return asc ? OrderDirection.ASC : OrderDirection.DESC;
}

export function getArrowDirection(asc: boolean): TableCellHeaderArrowDirection {
  return asc ? "asc" : "desc";
}

// Extracts Sort object from the querystring
export function getSortParams<
  TParams extends Sort<TFields>,
  TFields extends string
>(params: TParams): Sort<TFields> {
  return {
    asc: params.asc,
    sort: params.sort
  };
}

// Appends Sort object to the querystring params
export function asSortParams<
  TParams extends Record<any, string>,
  TFields extends Record<any, string>
>(
  params: TParams,
  fields: TFields,
  defaultField?: keyof TFields,
  defaultOrder?: boolean
): TParams & Sort {
  return {
    ...params,
    asc: parseBoolean(
      params.asc,
      defaultOrder === undefined ? true : defaultOrder
    ),
    sort: params.sort
      ? findValueInEnum(params.sort, fields)
      : defaultField?.toString() || "name"
  };
}

interface SortingInput<T extends string> {
  direction: OrderDirection;
  field: T;
}
type GetSortQueryField<TUrlField extends string, TSortField extends string> = (
  sort: TUrlField
) => TSortField;
type GetSortQueryVariables<
  TSortField extends string,
  TParams extends Record<any, any>
> = (params: TParams) => SortingInput<TSortField>;
export function createGetSortQueryVariables<
  TUrlField extends string,
  TSortField extends string,
  TParams extends Record<any, any>
>(
  getSortQueryField: GetSortQueryField<TUrlField, TSortField>
): GetSortQueryVariables<TSortField, TParams> {
  return (params: TParams) => {
    const field = getSortQueryField(params.sort);

    if (!!field) {
      return {
        direction: getOrderDirection(params.asc),
        field
      };
    }

    return undefined;
  };
}
