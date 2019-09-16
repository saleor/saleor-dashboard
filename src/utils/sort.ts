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
