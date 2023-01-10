import { order } from "@saleor/orders/fixtures";
import { render } from "@testing-library/react";
import React from "react";

import TableLine from "./TableLine";

describe("TableLine rendering", () => {
  it("renders with values from API", async () => {
    // Arrange
    const mockedLine = order("").lines[0];
    const props = {
      line: mockedLine,
      onOrderLineChange: jest.fn(),
      onOrderLineRemove: jest.fn(),
      addOrderLineDiscount: jest.fn(),
      removeOrderLineDiscount: jest.fn(),
      orderLineDiscountUpdateStatus: "default" as const,
      orderLineDiscountRemoveStatus: "default" as const,
      openDialog: jest.fn(),
      closeDialog: jest.fn(),
      isDialogOpen: false,
      totalDiscountedPrice: mockedLine.totalPrice.gross,
      unitUndiscountedPrice: mockedLine.undiscountedUnitPrice.gross,
      unitDiscountedPrice: mockedLine.unitPrice.gross,
    };

    // Act
    render(<TableLine {...props} />);
  });
});
