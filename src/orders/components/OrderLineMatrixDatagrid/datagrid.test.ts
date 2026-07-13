import {
  createGetCellContent,
  getMatrixColumnTooltipContent,
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
    grantedRefundEntries: [],
    shipments: [],
  };

  const getCellContent = createGetCellContent({
    columns,
    data: [lifecycle],
    loading: false,
    locale: "en",
    intl: intl as IntlShape,
    expandedLineId: null,
  });

  it("renders fulfillment refund quantity separately from transaction refunds", () => {
    // Arrange
    const refundedColumnIndex = 0;
    const grantedRefundColumnIndex = 1;

    // Act
    const fulfillmentCell = getCellContent([refundedColumnIndex, 0], { added: [], removed: [] });
    const transactionCell = getCellContent([grantedRefundColumnIndex, 0], {
      added: [],
      removed: [],
    });

    // Assert
    expect(fulfillmentCell).toMatchObject({ data: "2" });
    expect(transactionCell).toMatchObject({ data: "1" });
  });
});
