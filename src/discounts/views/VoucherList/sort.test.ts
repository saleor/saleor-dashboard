import { vouchersListStaticColumnsAdapter } from "@dashboard/discounts/components/VoucherListDatagrid/datagrid";
import { VoucherListUrlSortField } from "@dashboard/discounts/urls";
import { OrderDirection, VoucherSortField } from "@dashboard/graphql";
import { createIntl } from "react-intl";

import { getSortQueryVariables } from "./sort";

const intl = createIntl({ locale: "en" });

const getColumnIdByTitle = (title: string): VoucherListUrlSortField => {
  const columns = vouchersListStaticColumnsAdapter(intl, {
    sort: VoucherListUrlSortField.code,
    asc: true,
  });
  const columnId = columns.find(column => column.title === title)?.id;
  const sortField = Object.values(VoucherListUrlSortField).find(field => field === columnId);

  if (!sortField) {
    throw new Error(`No sortable "${title}" column in the voucher list`);
  }

  return sortField;
};

describe("getSortQueryVariables", () => {
  it("sorts the Name column by voucher name", () => {
    // Arrange
    const sort = getColumnIdByTitle("Name");

    // Act
    const variables = getSortQueryVariables({ sort, asc: false });

    // Assert
    expect(variables).toEqual({ field: VoucherSortField.NAME, direction: OrderDirection.DESC });
  });

  it("sorts the Ends column by end date", () => {
    // Arrange
    const sort = getColumnIdByTitle("Ends");

    // Act
    const variables = getSortQueryVariables({ sort, asc: true });

    // Assert
    expect(variables).toEqual({ field: VoucherSortField.END_DATE, direction: OrderDirection.ASC });
  });
});
