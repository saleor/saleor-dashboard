import { order } from "@saleor/orders/fixtures";
import { render, screen } from "@testing-library/react";
import React from "react";

import TableLine from "./TableLine";

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
}));

jest.mock("@saleor/macaw-ui", () => ({
  useStyles: jest.fn(() => () => ({})),
  makeStyles: jest.fn(() => () => ({})),
  Avatar: jest.fn(() => () => <></>),
  IconButton: jest.fn(() => () => <></>),
  DeleteIcon: jest.fn(() => () => <></>),
  ImageIcon: jest.fn(() => () => <></>),
}));

const mockedOrder = order("");

describe("TableLine rendering", () => {
  it("renders with values from API", async () => {
    // Arrange
    const mockedLine = mockedOrder.lines[0];
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

    // Assert
    const tableLine = screen.getByTestId(`table-line-total-${mockedLine.id}`);
    expect(tableLine).toHaveTextContent(
      mockedLine.totalPrice.gross.currency.toString(),
    );
  });
});
