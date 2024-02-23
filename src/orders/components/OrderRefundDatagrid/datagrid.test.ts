import { grantedRefunds } from "@dashboard/orders/fixtures";
import { GridCellKind } from "@glideapps/glide-data-grid";

import { createGetCellContent, useOrderRefundStaticColumns } from "./datagrid";

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

describe("Order refund datagrid", () => {
  it("presents user-created grant refund with status draft", () => {
    // Arrange
    const refunds = grantedRefunds;
    const columns = useOrderRefundStaticColumns();

    // Act
    const getCellContent = createGetCellContent({
      refunds,
      columns,
      currentTheme,
    });

    // Assert

    // Status column
    expect(getCellContent([1, 1])).toEqual(
      expect.objectContaining({
        data: {
          kind: "tags-cell",
          possibleTags: [{ tag: "DRAFT", color: "#ffe6c8" }],
          tags: ["DRAFT"],
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
  it("presents app-created grant refund with status draft", () => {
    // Arrange
    const refunds = grantedRefunds;
    const columns = useOrderRefundStaticColumns();

    // Act
    const getCellContent = createGetCellContent({
      refunds,
      columns,
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
