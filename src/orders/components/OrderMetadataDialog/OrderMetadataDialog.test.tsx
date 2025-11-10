import { fireEvent, render, screen } from "@testing-library/react";

import { OrderMetadataDialog, OrderMetadataDialogData } from "./OrderMetadataDialog";

const mockOnSubmit = jest.fn();

jest.mock("./useHandleSubmit", () => ({
  useHandleOrderMetadataSubmit: jest.fn(() => ({
    onSubmit: mockOnSubmit,
    lastSubmittedData: undefined,
    submitInProgress: false,
  })),
}));

const mockData: OrderMetadataDialogData = {
  id: "order-id",
  metadata: [{ key: "order-key", value: "order-value", __typename: "MetadataItem" }],
  privateMetadata: [
    {
      key: "order-private-key",
      value: "order-private-value",
      __typename: "MetadataItem",
    },
  ],
  __typename: "Order",
} as OrderMetadataDialogData;

describe("OrderMetadataDialog", () => {
  const onCloseMock = jest.fn();

  it("closes when user hits close icon button", () => {
    // Arrange
    render(
      <OrderMetadataDialog
        open={true}
        onClose={onCloseMock}
        orderId="order-id"
        data={mockData}
        loading={false}
      />,
    );

    // Act
    fireEvent.click(screen.getByTestId("close-button"));

    // Assert
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("closes when user hits close text button", () => {
    // Arrange
    render(
      <OrderMetadataDialog
        open={true}
        onClose={onCloseMock}
        orderId="order-id"
        data={mockData}
        loading={false}
      />,
    );

    // Act
    fireEvent.click(screen.getByTestId("back"));

    // Assert
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("displays dialog title", () => {
    // Arrange
    render(
      <OrderMetadataDialog
        open={true}
        onClose={onCloseMock}
        orderId="order-id"
        data={mockData}
        loading={false}
      />,
    );

    // Assert
    expect(screen.getByText("Order metadata")).toBeInTheDocument();
  });

  it("displays order metadata in editable form", () => {
    // Arrange
    render(
      <OrderMetadataDialog
        open={true}
        onClose={onCloseMock}
        orderId="order-id"
        data={mockData}
        loading={false}
      />,
    );

    // Act - expand metadata section
    const expandButtons = screen.getAllByTestId("expand");

    fireEvent.click(expandButtons[0]);

    // Assert - check metadata values after expansion
    expect(screen.getByDisplayValue("order-key")).toBeInTheDocument();
    expect(screen.getByDisplayValue("order-value")).toBeInTheDocument();
  });

  it("displays order private metadata in editable form", () => {
    // Arrange
    render(
      <OrderMetadataDialog
        open={true}
        onClose={onCloseMock}
        orderId="order-id"
        data={mockData}
        loading={false}
      />,
    );

    // Act - expand private metadata section
    const expandButtons = screen.getAllByTestId("expand");

    fireEvent.click(expandButtons[1]);

    // Assert - check private metadata values after expansion
    expect(screen.getByDisplayValue("order-private-key")).toBeInTheDocument();
    expect(screen.getByDisplayValue("order-private-value")).toBeInTheDocument();
  });

  it("displays loading state when loading is true", () => {
    // Arrange
    render(
      <OrderMetadataDialog
        open={true}
        onClose={onCloseMock}
        orderId="order-id"
        data={undefined}
        loading={true}
      />,
    );

    // Assert - check for loading cards
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);
  });
});
