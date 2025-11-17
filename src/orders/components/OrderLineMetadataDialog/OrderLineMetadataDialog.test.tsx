import { useHasManageProductsPermission } from "@dashboard/orders/hooks/useHasManageProductsPermission";
import { fireEvent, render, screen, within } from "@testing-library/react";

import { OrderLineMetadataDialog, OrderLineMetadataDialogData } from "./OrderLineMetadataDialog";
import { TEST_ID_ORDER_LINE_METADATA, TEST_ID_PRODUCT_VARIANT_METADATA } from "./test-ids";

const mockOnSubmit = jest.fn();

jest.mock("./useHandleSubmit", () => ({
  useHandleOrderLineMetadataSubmit: jest.fn(() => ({
    onSubmit: mockOnSubmit,
    lastSubmittedData: undefined,
    submitInProgress: false,
  })),
}));

jest.mock("@dashboard/orders/hooks/useHasManageProductsPermission", () => ({
  useHasManageProductsPermission: jest.fn(() => false),
}));

const mockData = {
  id: "order-line-id",
  productName: "Product Name",
  metadata: [{ key: "order-line-key", value: "order-line-value", __typename: "MetadataItem" }],
  privateMetadata: [
    {
      key: "order-line-private-key",
      value: "order-line-private-value",
      __typename: "MetadataItem",
    },
  ],
  quantity: 22222222,
  productSku: "product-sku",
  thumbnail: {
    url: "https://test.com/img.png",
    __typename: "Image",
  },
  variant: {
    id: "variant-id",
    metadata: [{ key: "variant-key", value: "variant-value", __typename: "MetadataItem" }],
    privateMetadata: [
      { key: "variant-private-key", value: "variant-private-value", __typename: "MetadataItem" },
    ],
    name: "Variant name",
    __typename: "ProductVariant",
  },
  __typename: "OrderLine",
} satisfies OrderLineMetadataDialogData;

jest.mock("./useMetadataValues", () => ({
  useMetadataValues: () => ({
    data: mockData,
    loading: false,
  }),
}));
describe("OrderLineMetadataDialog", () => {
  const onCloseMock = jest.fn();

  it("closes when user hits close icon button", () => {
    // Arrange
    render(
      <OrderLineMetadataDialog
        open={true}
        onClose={onCloseMock}
        orderId="order-id"
        lineId={mockData.id}
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
      <OrderLineMetadataDialog
        open={true}
        onClose={onCloseMock}
        orderId="order-id"
        lineId={mockData.id}
      />,
    );

    // Act
    fireEvent.click(screen.getByTestId("back"));

    // Assert
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("displays details about order line", () => {
    // Arrange
    render(
      <OrderLineMetadataDialog
        open={true}
        onClose={onCloseMock}
        orderId="order-id"
        lineId={mockData.id}
      />,
    );

    // Assert
    expect(screen.queryByText(mockData.quantity)).toBeInTheDocument();
    expect(screen.queryByText(mockData.variant.name)).toBeInTheDocument();
    expect(screen.queryByText(mockData.productSku)).toBeInTheDocument();
  });

  it("renders product thumbnail correctly", () => {
    // Arrange
    render(
      <OrderLineMetadataDialog
        open={true}
        onClose={onCloseMock}
        orderId="order-id"
        lineId={mockData.id}
      />,
    );

    // Assert
    const thumbnailImage = screen.getByRole("img");

    expect(thumbnailImage).toBeInTheDocument();
    expect(thumbnailImage).toHaveAttribute("src", mockData.thumbnail.url);
  });

  describe("ProductVariant metadata form", () => {
    it("displays product variant metadata in editable form", async () => {
      // Arrange
      (useHasManageProductsPermission as jest.Mock).mockReturnValue(true);
      render(
        <OrderLineMetadataDialog
          open={true}
          onClose={onCloseMock}
          orderId="order-id"
          lineId={mockData.id}
        />,
      );

      const productVariantMetadata = screen.getByTestId(TEST_ID_PRODUCT_VARIANT_METADATA);

      // Act - expand metadata section
      const expandButtons = within(productVariantMetadata).getAllByTestId("expand");

      fireEvent.click(expandButtons[0]);

      // Assert - check metadata values after expansion
      expect(screen.getByText("Product variant metadata")).toBeInTheDocument();
      expect(within(productVariantMetadata).getByDisplayValue("variant-key")).toBeInTheDocument();
      expect(within(productVariantMetadata).getByDisplayValue("variant-value")).toBeInTheDocument();
    });

    it("displays product variant private metadata when user has MANAGE_PRODUCTS permission", () => {
      // Arrange
      (useHasManageProductsPermission as jest.Mock).mockReturnValue(true);
      render(
        <OrderLineMetadataDialog
          open={true}
          onClose={onCloseMock}
          orderId="order-id"
          lineId={mockData.id}
        />,
      );

      const productVariantMetadata = screen.getByTestId(TEST_ID_PRODUCT_VARIANT_METADATA);

      // Act - expand private metadata section
      const expandButtons = within(productVariantMetadata).getAllByTestId("expand");

      fireEvent.click(expandButtons[1]);

      // Assert - check private metadata values after expansion
      expect(
        within(productVariantMetadata).getByDisplayValue("variant-private-key"),
      ).toBeInTheDocument();
      expect(
        within(productVariantMetadata).getByDisplayValue("variant-private-value"),
      ).toBeInTheDocument();
    });

    it("hides and disables variant metadata editing when user doesn't have MANAGE_PRODUCTS permission", () => {
      // Arrange
      (useHasManageProductsPermission as jest.Mock).mockReturnValue(false);
      render(
        <OrderLineMetadataDialog
          open={true}
          onClose={onCloseMock}
          orderId="order-id"
          lineId={mockData.id}
        />,
      );

      const productVariantMetadata = screen.getByTestId(TEST_ID_PRODUCT_VARIANT_METADATA);

      // Act - expand public metadata section
      const expandButtons = within(productVariantMetadata).getAllByTestId("expand");

      // Should only have 1 expand button (for public metadata, not private)
      expect(expandButtons.length).toBe(1);

      fireEvent.click(expandButtons[0]);

      // Assert - variant metadata fields should be disabled
      const variantKeyInput = within(productVariantMetadata).getByDisplayValue(
        "variant-key",
      ) as HTMLInputElement;
      const variantValueInput = within(productVariantMetadata).getByDisplayValue(
        "variant-value",
      ) as HTMLInputElement;

      expect(variantKeyInput.disabled).toBe(true);
      expect(variantValueInput.disabled).toBe(true);
    });
  });

  describe("OrderLine metadata's form", () => {
    it("displays order line metadata", async () => {
      // Arrange
      render(
        <OrderLineMetadataDialog
          open={true}
          onClose={onCloseMock}
          orderId="order-id"
          lineId={mockData.id}
        />,
      );

      const orderLineMetadata = screen.getByTestId(TEST_ID_ORDER_LINE_METADATA);

      // Act - expand metadata section
      const expandButtonOrderLineMetadata = within(orderLineMetadata).getAllByTestId("expand")[0];

      fireEvent.click(expandButtonOrderLineMetadata);

      // Assert - check metadata values after expansion
      expect(within(orderLineMetadata).getByDisplayValue("order-line-key")).toBeInTheDocument();
      expect(within(orderLineMetadata).getByDisplayValue("order-line-value")).toBeInTheDocument();
      expect(
        within(orderLineMetadata).queryByDisplayValue("order-line-private-key"),
      ).not.toBeInTheDocument();
      expect(
        within(orderLineMetadata).queryByDisplayValue("order-line-private-value"),
      ).not.toBeInTheDocument();
    });

    it("displays order line private metadata", () => {
      // Arrange
      render(
        <OrderLineMetadataDialog
          open={true}
          onClose={onCloseMock}
          orderId="order-id"
          lineId={mockData.id}
        />,
      );

      const orderLineMetadata = screen.getByTestId(TEST_ID_ORDER_LINE_METADATA);

      // Act - expand private metadata section
      const expandButtonOrderLinePrivateMetadata =
        within(orderLineMetadata).getAllByTestId("expand")[1];

      fireEvent.click(expandButtonOrderLinePrivateMetadata);

      // Assert - check private metadata values after expansion
      expect(
        within(orderLineMetadata).getByDisplayValue("order-line-private-key"),
      ).toBeInTheDocument();
      expect(
        within(orderLineMetadata).getByDisplayValue("order-line-private-value"),
      ).toBeInTheDocument();
      expect(
        within(orderLineMetadata).queryByDisplayValue("order-line-key"),
      ).not.toBeInTheDocument();
      expect(
        within(orderLineMetadata).queryByDisplayValue("order-line-value"),
      ).not.toBeInTheDocument();
    });
  });
});
