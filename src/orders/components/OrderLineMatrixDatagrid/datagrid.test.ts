import { type GetCellContentOpts } from "@dashboard/components/Datagrid/Datagrid";
import { Locale } from "@dashboard/components/Locale";
import {
  createGetCellContent,
  getMatrixColumnTooltipContent,
  mapPinnedGridColumnMove,
  shouldMigrateMatrixProductColumn,
  withMigratedProductColumn,
} from "@dashboard/orders/components/OrderLineMatrixDatagrid/datagrid";
import { messages } from "@dashboard/orders/components/OrderLineMatrixDatagrid/messages";
import { OrderFixture } from "@dashboard/orders/fixtures/OrderFixture";
import { type OrderLineLifecycle } from "@dashboard/orders/utils/buildOrderLineLifecycle";
import { type IntlShape } from "react-intl";

describe("getMatrixColumnTooltipContent", () => {
  const intl: Pick<IntlShape, "formatMessage"> = {
    formatMessage: (descriptor: { defaultMessage: string }) => descriptor.defaultMessage,
  };

  it("returns fulfillment refund column helper text", () => {
    // Arrange // Act
    const tooltip = getMatrixColumnTooltipContent("refunded", intl as IntlShape);

    // Assert
    expect(tooltip).toBe(messages.refundedTooltip.defaultMessage);
  });

  it("returns transaction refund column helper text", () => {
    // Arrange // Act
    const tooltip = getMatrixColumnTooltipContent("grantedRefund", intl as IntlShape);

    // Assert
    expect(tooltip).toBe(messages.grantedRefundTooltip.defaultMessage);
  });

  it("returns empty string for other columns", () => {
    // Arrange // Act
    const tooltip = getMatrixColumnTooltipContent("shipped", intl as IntlShape);

    // Assert
    expect(tooltip).toBe("");
  });
});

describe("mapPinnedGridColumnMove", () => {
  const pinnedColumnCount = 1;

  it("maps grid indices to unpinned column indices", () => {
    // Arrange // Act
    const mappedMove = mapPinnedGridColumnMove(3, 5, pinnedColumnCount);

    // Assert
    expect(mappedMove).toEqual({ startIndex: 2, endIndex: 4 });
  });

  it("returns null when moving a pinned column", () => {
    // Arrange // Act
    const mappedMove = mapPinnedGridColumnMove(0, 3, pinnedColumnCount);

    // Assert
    expect(mappedMove).toBeNull();
  });

  it("returns null when dropping onto a pinned column", () => {
    // Arrange // Act
    const mappedMove = mapPinnedGridColumnMove(3, 0, pinnedColumnCount);

    // Assert
    expect(mappedMove).toBeNull();
  });
});

describe("matrix product column migration", () => {
  it("prepends product when legacy settings omit it", () => {
    // Arrange
    const columns = ["sku", "ordered", "price"];

    // Act
    const migratedColumns = withMigratedProductColumn(columns);

    // Assert
    expect(migratedColumns).toEqual(["product", "sku", "ordered", "price"]);
  });

  it("keeps custom layouts that already include product", () => {
    // Arrange
    const columns = ["sku", "product", "ordered"];

    // Act
    const migratedColumns = withMigratedProductColumn(columns);

    // Assert
    expect(migratedColumns).toBe(columns);
  });

  it("migrates only legacy settings without product once", () => {
    // Arrange // Act // Assert
    expect(shouldMigrateMatrixProductColumn(["sku", "ordered"])).toBe(true);
    expect(shouldMigrateMatrixProductColumn(["product", "sku"])).toBe(false);
    expect(shouldMigrateMatrixProductColumn(undefined)).toBe(false);
  });
});

describe("createGetCellContent refunded columns", () => {
  const intl: Pick<IntlShape, "formatMessage"> = {
    formatMessage: (descriptor: { defaultMessage: string }) => descriptor.defaultMessage,
  };
  const columns = [
    { id: "refunded", title: "Fulfillment refund", width: 120 },
    { id: "grantedRefund", title: "Transaction refund", width: 120 },
  ];
  const line = OrderFixture.fulfilled().build().lines[0];
  const lifecycle: OrderLineLifecycle = {
    orderLineId: line.id,
    orderLine: line,
    ordered: 3,
    allocated: 0,
    toFulfill: 0,
    shipped: 1,
    pendingApproval: 0,
    returned: 0,
    refundedFulfillment: 2,
    replaced: 0,
    grantedRefund: 1,
    grantedRefundAmount: { amount: 25, currency: "USD" },
    refundedFulfillmentAmount: { amount: 50, currency: "USD" },
    grantedRefundEntries: [],
    reasonDisplay: null,
    shipments: [],
  };

  const getCellContent = createGetCellContent({
    columns,
    data: [lifecycle],
    loading: false,
    locale: Locale.EN,
    intl: intl as IntlShape,
    expandedLineId: null,
  });
  const getCellContentOpts: GetCellContentOpts = {
    changes: { current: [] },
    added: [],
    removed: [],
    getChangeIndex: () => -1,
  };

  it("renders fulfillment refund quantity separately from transaction refunds", () => {
    // Arrange
    const refundedColumnIndex = 0;
    const grantedRefundColumnIndex = 1;

    // Act
    const fulfillmentCell = getCellContent([refundedColumnIndex, 0], getCellContentOpts);
    const transactionCell = getCellContent([grantedRefundColumnIndex, 0], getCellContentOpts);

    // Assert
    expect(fulfillmentCell).toMatchObject({ data: expect.stringMatching(/^2 · /) });
    expect(transactionCell).toMatchObject({ data: expect.stringMatching(/^1 · /) });
  });
});
