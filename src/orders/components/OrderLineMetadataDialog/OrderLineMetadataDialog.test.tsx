import { useHasManageProductsPermission } from "@dashboard/orders/hooks/useHasManageProductsPermission";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { type ComponentProps } from "react";

import {
  OrderLineMetadataDialog,
  type OrderLineMetadataDialogData,
} from "./OrderLineMetadataDialog";
import { TEST_ID_ORDER_LINE_METADATA, TEST_ID_PRODUCT_VARIANT_METADATA } from "./test-ids";
import { useMetadataValues } from "./useMetadataValues";

const mockOnSubmit = jest.fn();

jest.mock("./useHandleSubmit", () => ({
  useHandleOrderLineMetadataSubmit: jest.fn(() => ({
    onSubmit: mockOnSubmit,
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
  useMetadataValues: jest.fn(() => ({
    data: mockData,
    loading: false,
  })),
}));

const mockUseMetadataValues = useMetadataValues as jest.MockedFunction<typeof useMetadataValues>;

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
    expect(
      screen.getByText(`${mockData.productName} · ${mockData.variant.name}`),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`SKU: ${mockData.productSku} · Qty: ${mockData.quantity}`),
    ).toBeInTheDocument();
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
    beforeEach(() => {
      (useMetadataValues as jest.Mock).mockReturnValue({
        data: mockData,
        loading: false,
      });
    });

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

    it("can save an edit to only the variant's metadata", () => {
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

      fireEvent.click(within(productVariantMetadata).getAllByTestId("expand")[0]);

      // Act
      fireEvent.change(within(productVariantMetadata).getByDisplayValue("variant-value"), {
        target: { value: "edited-variant-value" },
      });

      // Assert
      expect(screen.getByTestId("save")).toBeEnabled();
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

    it("hides expand controls for empty read-only variant metadata", () => {
      // Arrange
      (useMetadataValues as jest.Mock).mockReturnValue({
        data: {
          ...mockData,
          variant: {
            ...mockData.variant,
            metadata: [],
            privateMetadata: [],
          },
        },
        loading: false,
      });
      render(
        <OrderLineMetadataDialog
          open={true}
          onClose={onCloseMock}
          orderId="order-id"
          lineId={mockData.id}
        />,
      );

      const productVariantMetadata = screen.getByTestId(TEST_ID_PRODUCT_VARIANT_METADATA);

      // Assert
      expect(within(productVariantMetadata).queryAllByTestId("expand")).toHaveLength(0);
      expect(within(productVariantMetadata).getAllByText("Empty")).toHaveLength(2);
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

      // Assert - variant metadata fields should be readonly
      const variantKeyInput = within(productVariantMetadata).getByDisplayValue(
        "variant-key",
      ) as HTMLInputElement;
      const variantValueInput = within(productVariantMetadata).getByDisplayValue(
        "variant-value",
      ) as HTMLTextAreaElement;

      expect(variantKeyInput.readOnly).toBe(true);
      expect(variantValueInput.readOnly).toBe(true);
    });
  });

  describe("OrderLine metadata's form", () => {
    const loadedImplementation = mockUseMetadataValues.getMockImplementation();

    afterEach(() => {
      if (loadedImplementation) {
        mockUseMetadataValues.mockImplementation(loadedImplementation);
      }
    });

    it("keeps an edit being typed when the metadata is loaded again", () => {
      // Arrange
      const props: ComponentProps<typeof OrderLineMetadataDialog> = {
        open: true,
        onClose: onCloseMock,
        orderId: "order-id",
        lineId: mockData.id,
      };
      const { rerender } = render(<OrderLineMetadataDialog {...props} />);
      const orderLineMetadata = screen.getByTestId(TEST_ID_ORDER_LINE_METADATA);

      fireEvent.click(within(orderLineMetadata).getAllByTestId("expand")[0]);
      fireEvent.change(within(orderLineMetadata).getByDisplayValue("order-line-value"), {
        target: { value: "typed-value" },
      });

      // Act: an app adds a key and the dialog loads the line again.
      mockUseMetadataValues.mockImplementation(() => ({
        data: {
          ...mockData,
          metadata: [
            ...mockData.metadata,
            { key: "app-key", value: "app-value", __typename: "MetadataItem" },
          ],
        },
        loading: false,
        loadFailed: false,
        retry: jest.fn(),
      }));
      rerender(<OrderLineMetadataDialog {...props} />);

      // Assert: the form stays as the user left it; saving sends only their change.
      expect(within(orderLineMetadata).getByDisplayValue("typed-value")).toBeInTheDocument();
      expect(within(orderLineMetadata).queryByDisplayValue("app-value")).not.toBeInTheDocument();
      expect(screen.getByTestId("save")).toBeEnabled();
    });

    it("shows no error for a new blank row, and can be saved once the row is filled in", async () => {
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

      fireEvent.click(within(orderLineMetadata).getAllByTestId("expand")[0]);

      // Act
      fireEvent.click(within(orderLineMetadata).getAllByTestId("add-field")[0]);
      // Let the rows' validation finish.
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Assert
      expect(within(orderLineMetadata).queryByText("Metadata key cannot be empty")).toBeNull();
      expect(screen.getByTestId("save")).toBeDisabled();

      const newKey = orderLineMetadata.querySelector<HTMLInputElement>('[aria-label="name:1"]');
      const newValue = orderLineMetadata.querySelector<HTMLInputElement>('[aria-label="value:1"]');

      if (!newKey || !newValue) {
        throw new Error("The added row isn't rendered");
      }

      fireEvent.change(newKey, { target: { value: "new-key" } });
      fireEvent.change(newValue, { target: { value: "new-value" } });

      expect(screen.getByTestId("save")).toBeEnabled();
    });

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

  describe("when the metadata couldn't be loaded", () => {
    const loadedImplementation = mockUseMetadataValues.getMockImplementation();

    afterEach(() => {
      if (loadedImplementation) {
        mockUseMetadataValues.mockImplementation(loadedImplementation);
      }
    });

    it("shows the error with Retry instead of empty editors, and keeps Save disabled", () => {
      // Arrange
      const retry = jest.fn();

      mockUseMetadataValues.mockImplementation(() => ({
        data: undefined,
        loading: false,
        loadFailed: true,
        retry,
      }));
      render(
        <OrderLineMetadataDialog
          open={true}
          onClose={onCloseMock}
          orderId="order-id"
          lineId={mockData.id}
        />,
      );

      // Act
      fireEvent.click(screen.getByRole("button", { name: "Retry" }));

      // Assert
      expect(screen.getByRole("alert")).toHaveTextContent("Couldn't load metadata");
      expect(screen.queryByTestId("metadata-editor")).not.toBeInTheDocument();
      expect(screen.getByTestId("save")).toBeDisabled();
      expect(retry).toHaveBeenCalledTimes(1);
    });
  });
});
