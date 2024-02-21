import { grantedRefunds } from "@dashboard/orders/fixtures";
import { GridCellKind } from "@glideapps/glide-data-grid";
import { intlMock } from "@test/intl";

import {
  createGetCellContent,
  orderRefundStaticColumnsAdapter,
} from "./datagrid";

const emptyColumn = {
  id: "empty",
  title: "",
  width: 20,
};
const currentTheme = "defaultLight";

describe("Order refund datagrid", () => {
  it("getCellContent returns proper data", () => {
    // Arrange
    const refunds = grantedRefunds;

    // Act
    const getCellContent = createGetCellContent({
      refunds,
      columns: orderRefundStaticColumnsAdapter(emptyColumn, intlMock),
      currentTheme,
    });

    // Assert

    // Status column
    expect(getCellContent([1, 0])).toEqual(
      expect.objectContaining({
        data: {
          kind: "tags-cell",
          possibleTags: [{ tag: "DRAFT", color: "#ffe6c8" }],
          tags: ["DRAFT"],
        },
      }),
    );

    // Amount column
    expect(getCellContent([2, 0])).toEqual(
      expect.objectContaining({
        data: {
          kind: "money-cell",
          value: 234.93,
          currency: "USD",
        },
      }),
    );

    // Reason column
    expect(getCellContent([3, 0])).toEqual(
      expect.objectContaining({
        data: "Products returned",
        kind: GridCellKind.Text,
      }),
    );
    expect(getCellContent([3, 1])).toEqual(
      expect.objectContaining({
        data: "Products arrived damaged",
        kind: GridCellKind.Text,
      }),
    );

    // Date column
    expect(getCellContent([4, 0])).toEqual(
      expect.objectContaining({
        data: {
          kind: "date-cell",
          value: "2022-08-22T10:40:22.226875+00:00",
        },
      }),
    );

    // Account column
    expect(getCellContent([5, 1])).toEqual(
      expect.objectContaining({
        data: "john.doe@example.com",
        kind: GridCellKind.Text,
      }),
    );
  });
});
