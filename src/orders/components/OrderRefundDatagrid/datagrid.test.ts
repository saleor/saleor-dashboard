import { grantedRefunds } from "@dashboard/orders/fixtures";
import { GridCellKind } from "@glideapps/glide-data-grid";
import { intlMock } from "@test/intl";

import { createGetCellContent, useOrderRefundStaticColumns } from "./datagrid";
import { DatagridRefund } from "./utils";

const currentTheme = "defaultLight";

jest.mock("react-intl", () => ({
  useIntl: () => ({
    formatMessage: ({ defaultMessage }: { defaultMessage: string }) =>
      defaultMessage,
  }),
  defineMessages: jest.fn(x => x),
}));

jest.mock("@dashboard/components/Datagrid/hooks/useEmptyColumn", () => ({
  useEmptyColumn: () => ({
    id: "empty",
    title: "",
    width: 20,
  }),
}));

const mockedRefunds: DatagridRefund[] = grantedRefunds.map(refund => ({
  ...refund,
  type: "manual",
}));

describe("Order refund datagrid", () => {
  it("presents grant refund with status draft created by user", () => {
    // Arrange
    const refunds = mockedRefunds;
    const columns = useOrderRefundStaticColumns();

    // Act
    const getCellContent = createGetCellContent({
      refunds,
      columns,
      currentTheme,
      intl: intlMock,
    });

    // Assert

    // Status column
    expect(getCellContent([1, 1])).toEqual(
      expect.objectContaining({
        allowOverlay: true,
        copyData: "Success",
        data: {
          kind: "tags-cell",
          possibleTags: [{ tag: "Success", color: "#d7f5d7" }],
          tags: ["Success"],
        },
      }),
    );

    // Amount column
    expect(getCellContent([2, 1])).toEqual(
      expect.objectContaining({
        data: {
          kind: "money-cell",
          value: 234.93,
          currency: "USD",
        },
      }),
    );

    // Reason column
    expect(getCellContent([3, 1])).toEqual(
      expect.objectContaining({
        data: "Products arrived damaged",
        kind: GridCellKind.Text,
      }),
    );

    // Date column
    expect(getCellContent([4, 1])).toEqual(
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
  it("presents grant refund with status draft created by app", () => {
    // Arrange
    const refunds = mockedRefunds;
    const columns = useOrderRefundStaticColumns();

    // Act
    const getCellContent = createGetCellContent({
      refunds,
      columns,
      currentTheme,
      intl: intlMock,
    });

    // Assert

    // Status column
    expect(getCellContent([1, 0])).toEqual(
      expect.objectContaining({
        allowOverlay: true,
        copyData: "Success",
        data: {
          kind: "tags-cell",
          possibleTags: [{ tag: "Success", color: "#d7f5d7" }],
          tags: ["Success"],
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
    expect(getCellContent([5, 0])).toEqual(
      expect.objectContaining({
        data: "",
        kind: GridCellKind.Text,
      }),
    );
  });
});
