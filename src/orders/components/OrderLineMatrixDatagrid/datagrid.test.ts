import { getMatrixColumnTooltipContent } from "@dashboard/orders/components/OrderLineMatrixDatagrid/datagrid";
import { messages } from "@dashboard/orders/components/OrderLineMatrixDatagrid/messages";
import { type IntlShape } from "react-intl";

describe("getMatrixColumnTooltipContent", () => {
  const intl: Pick<IntlShape, "formatMessage"> = {
    formatMessage: (descriptor: { defaultMessage: string }) => descriptor.defaultMessage,
  };

  it("returns refunded column helper text", () => {
    // Arrange // Act
    const tooltip = getMatrixColumnTooltipContent("refunded", intl as IntlShape);

    // Assert
    expect(tooltip).toBe(messages.refundedTooltip.defaultMessage);
  });

  it("returns empty string for other columns", () => {
    // Arrange // Act
    const tooltip = getMatrixColumnTooltipContent("shipped", intl as IntlShape);

    // Assert
    expect(tooltip).toBe("");
  });
});
