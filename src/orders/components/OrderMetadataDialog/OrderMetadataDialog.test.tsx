import { MockedProvider } from "@apollo/client/testing";
import { MessageContext } from "@dashboard/components/messages";
import { UpdateMetadataDocument, UpdatePrivateMetadataDocument } from "@dashboard/graphql";
import { useHasManageProductsPermission } from "@dashboard/orders/hooks/useHasManageProductsPermission";
import { CustomMockedProvider } from "@test/customProvider";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import { OrderMetadataDialog, OrderMetadataDialogData } from "./OrderMetadataDialog";
import { TEST_ID_ORDER_LINE_METADATA, TEST_ID_PRODUCT_VARIANT_METADATA } from "./test-ids";

jest.mock("react-intl", () => ({
  FormattedMessage: props => <>{props.defaultMessage || props.id || ""}</>,
  defineMessages: messages => messages,
  useIntl: () => ({
    formatMessage: ({ defaultMessage }) => defaultMessage,
  }),
}));

jest.mock("@dashboard/orders/hooks/useHasManageProductsPermission", () => ({
  useHasManageProductsPermission: jest.fn(() => false),
}));

jest.mock("@dashboard/hooks/useNotifier", () => ({
  __esModule: true,
  default: () => jest.fn(),
}));

const mockData: OrderMetadataDialogData = {
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
  variant: {
    id: "variant-id",
    metadata: [{ key: "variant-key", value: "variant-value", __typename: "MetadataItem" }],
    privateMetadata: [
      { key: "variant-private-key", value: "variant-private-value", __typename: "MetadataItem" },
    ],
  },
};

describe("OrderMetadataDialog", () => {
  const onCloseMock = jest.fn();
  const notifierMock = {
    show: jest.fn(),
    remove: jest.fn(),
    clearErrorNotifications: jest.fn(),
  };

  const wrapper = ({ children }) => (
    <MessageContext.Provider value={notifierMock}>{children}</MessageContext.Provider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("closes when user hits close icon button", () => {
    render(
      <MockedProvider>
        <OrderMetadataDialog open={true} onClose={onCloseMock} data={mockData} />
      </MockedProvider>,
      { wrapper },
    );

    fireEvent.click(screen.getByTestId("close-button"));
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("closes when user hits close text button", () => {
    render(
      <MockedProvider>
        <OrderMetadataDialog open={true} onClose={onCloseMock} data={mockData} />
      </MockedProvider>,
      { wrapper },
    );

    fireEvent.click(screen.getByTestId("back"));
    expect(onCloseMock).toHaveBeenCalled();
  });

  describe("ProductVariant metadata list", () => {
    it("displays product variant metadata", async () => {
      render(
        <MockedProvider>
          <OrderMetadataDialog open={true} onClose={onCloseMock} data={mockData} />
        </MockedProvider>,
        { wrapper },
      );

      expect(screen.getByText("Product variant metadata")).toBeInTheDocument();

      const productVariantMetadata = screen.getByTestId(TEST_ID_PRODUCT_VARIANT_METADATA);

      // Readonly metadata component displays all existing data
      // expand doesn't need to be used
      expect(within(productVariantMetadata).getByDisplayValue("variant-key")).toBeInTheDocument();
      expect(within(productVariantMetadata).getByDisplayValue("variant-value")).toBeInTheDocument();
      expect(
        within(productVariantMetadata).getByDisplayValue("variant-private-key"),
      ).toBeInTheDocument();
      expect(
        within(productVariantMetadata).getByDisplayValue("variant-private-value"),
      ).toBeInTheDocument();
    });

    it("hides privateMetadata from product variant when user doesn't have MANAGE_PRODUCTS permission", () => {
      (useHasManageProductsPermission as jest.Mock).mockReturnValue(false);

      render(
        <MockedProvider>
          <OrderMetadataDialog open={true} onClose={onCloseMock} data={mockData} />
        </MockedProvider>,
        { wrapper },
      );

      // Private metadata should not be visible in the readonly section
      const metadataEditors = screen.getAllByTestId("metadata-editor");
      const readonlyEditor = metadataEditors[1];

      expect(readonlyEditor).not.toHaveTextContent("variant-private-key");
      expect(readonlyEditor).not.toHaveTextContent("variant-private-value");
    });
  });

  describe("OrderLine metadata form", () => {
    it("displays order line metadata", async () => {
      render(
        <MockedProvider>
          <OrderMetadataDialog open={true} onClose={onCloseMock} data={mockData} />
        </MockedProvider>,
        { wrapper },
      );

      const orderLineMetadata = screen.getByTestId(TEST_ID_ORDER_LINE_METADATA);
      const expandButtonOrderLineMetadata = within(orderLineMetadata).getAllByTestId("expand")[0];

      expect(screen.getByText("Order line metadata")).toBeInTheDocument();

      // Show metadata
      fireEvent.click(expandButtonOrderLineMetadata);

      // Metadata is visible, private metadata is not
      expect(within(orderLineMetadata).getByDisplayValue("order-line-key")).toBeInTheDocument();
      expect(within(orderLineMetadata).getByDisplayValue("order-line-value")).toBeInTheDocument();
      expect(
        within(orderLineMetadata).queryByDisplayValue("order-line-private-key"),
      ).not.toBeInTheDocument();
      expect(
        within(orderLineMetadata).queryByDisplayValue("order-line-private-value"),
      ).not.toBeInTheDocument();
    });

    it("allows editing existing metadata", async () => {
      const newValue = "new-value";

      const updateMetadataMock = {
        request: {
          query: UpdateMetadataDocument,
        },
        variableMatcher: jest.fn().mockReturnValue(true),
        newValue: {
          data: {
            updateMetadata: {
              item: {
                ...mockData,
                metadata: [
                  ...mockData.metadata,
                  { key: "new-key", value: "new-value", __typename: "MetadataItem" },
                ],
              },
              errors: [],
            },
          },
        },
      };

      render(
        <CustomMockedProvider mocks={[updateMetadataMock]} addTypename={false}>
          <OrderMetadataDialog open={true} onClose={onCloseMock} data={mockData} />
        </CustomMockedProvider>,
        { wrapper },
      );

      const orderLineMetadata = screen.getByTestId(TEST_ID_ORDER_LINE_METADATA);
      const expandButtonOrderLineMetadata = within(orderLineMetadata).getAllByTestId("expand")[0];

      // Show metadata
      fireEvent.click(expandButtonOrderLineMetadata);

      // Verify existing metadata is displayed
      const existingKeyInput = within(orderLineMetadata).getByDisplayValue("order-line-key");
      const existingValueInput = within(orderLineMetadata).getByDisplayValue("order-line-value");

      expect(existingKeyInput).toBeInTheDocument();
      expect(existingValueInput).toBeInTheDocument();

      // Before making changes save buttoon should be duisabled
      expect(screen.getByTestId("save")).toBeDisabled();

      // Change a field value
      const orderLineMetadataSection = screen.getByTestId("order-line-metadata");
      const valueInput = within(orderLineMetadataSection).getByTestId("metadata-value-input");

      await userEvent.clear(valueInput);
      await userEvent.type(valueInput, newValue);

      expect(screen.getByTestId("save")).toBeEnabled();

      await userEvent.click(screen.getByTestId("save"));

      expect(updateMetadataMock.variableMatcher).toHaveBeenCalledWith({
        id: mockData.id,
        input: [{ key: mockData.metadata[0].key, value: newValue }],
        keysToDelete: [],
      });
    });

    it("allows adding new metadata", async () => {
      const updateMetadataMock = {
        request: {
          query: UpdateMetadataDocument,
        },
        variableMatcher: jest.fn().mockReturnValue(true),
        newValue: {
          data: {
            updateMetadata: {
              item: {
                ...mockData,
                metadata: [
                  ...mockData.metadata,
                  { key: "new-key", value: "new-value", __typename: "MetadataItem" },
                ],
              },
              errors: [],
            },
          },
        },
      };

      render(
        <CustomMockedProvider mocks={[updateMetadataMock]} addTypename={false}>
          <OrderMetadataDialog open={true} onClose={onCloseMock} data={mockData} />
        </CustomMockedProvider>,
        { wrapper },
      );

      const orderLineMetadata = screen.getByTestId(TEST_ID_ORDER_LINE_METADATA);
      const expandButtonOrderLineMetadata = within(orderLineMetadata).getAllByTestId("expand")[0];

      // Show metadata form
      fireEvent.click(expandButtonOrderLineMetadata);

      const addButton = within(orderLineMetadata).getByTestId("add-field");

      fireEvent.click(addButton);

      const keyInputs = within(orderLineMetadata).getAllByTestId("metadata-key-input");
      const valueInputs = within(orderLineMetadata).getAllByTestId("metadata-value-input");
      const newKeyInput = keyInputs[keyInputs.length - 1];
      const newValueInput = valueInputs[valueInputs.length - 1];

      fireEvent.change(newKeyInput, { target: { value: "new-key" } });
      fireEvent.change(newValueInput, { target: { value: "new-value" } });

      expect(screen.getByTestId("save")).toBeEnabled();

      await userEvent.click(screen.getByTestId("save"));

      expect(updateMetadataMock.variableMatcher).toHaveBeenCalledWith({
        id: mockData.id,
        input: [
          // Note: input doesn't include __typename
          { key: mockData.metadata[0].key, value: mockData.metadata[0].value },
          { key: "new-key", value: "new-value" },
        ],
        keysToDelete: [],
      });
    });

    it("shows validation error when user inputs metadata with the same key", async () => {
      render(
        <MockedProvider>
          <OrderMetadataDialog open={true} onClose={onCloseMock} data={mockData} />
        </MockedProvider>,
        { wrapper },
      );

      const orderLineMetadata = screen.getByTestId(TEST_ID_ORDER_LINE_METADATA);
      const expandButtonOrderLineMetadata = within(orderLineMetadata).getAllByTestId("expand")[0];

      // Show metadata
      fireEvent.click(expandButtonOrderLineMetadata);

      // Open input to add new metadata
      const addButton = within(orderLineMetadata).getByTestId("add-field");

      fireEvent.click(addButton);

      const keyInputs = within(orderLineMetadata).getAllByTestId("metadata-key-input");
      const valueInputs = within(orderLineMetadata).getAllByTestId("metadata-value-input");
      const newKeyInput = keyInputs[keyInputs.length - 1];
      const newValueInput = valueInputs[valueInputs.length - 1];

      // Try to add metadata with duplicate key
      fireEvent.change(newKeyInput, { target: { value: "order-line-key" } }); // This key already exists
      fireEvent.change(newValueInput, { target: { value: "new-value" } });

      // Submit the form
      await userEvent.click(screen.getByTestId("save"));

      expect(
        screen.getByText("Metadata keys must be unique, remove duplicate key"),
      ).toBeInTheDocument();
    });
  });

  describe("OrderLine privateMetadata form", () => {
    it("displays order line private metadata", () => {
      render(
        <MockedProvider>
          <OrderMetadataDialog open={true} onClose={onCloseMock} data={mockData} />
        </MockedProvider>,
        { wrapper },
      );

      const orderLineMetadata = screen.getByTestId(TEST_ID_ORDER_LINE_METADATA);
      const expandButtonOrderLinePrivateMetadata =
        within(orderLineMetadata).getAllByTestId("expand")[1];

      // Show privateMetadata
      fireEvent.click(expandButtonOrderLinePrivateMetadata);

      // Private metadata is visible, metadata is not
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

    it("allows adding new private metadata", async () => {
      const updatePrivateMetadataMock = {
        request: {
          query: UpdatePrivateMetadataDocument,
        },
        variableMatcher: jest.fn().mockReturnValue(true),
        newValue: {
          data: {
            updatePrivateMetadata: {
              item: {
                privateMetadata: [
                  ...mockData.privateMetadata,
                  {
                    key: "new-private-key",
                    value: "new-private-value",
                    __typename: "MetadataItem",
                  },
                ],
                id: "order-line-id",
                __typename: "OrderLine",
              },
              errors: [],
            },
          },
        },
      };

      render(
        <CustomMockedProvider mocks={[updatePrivateMetadataMock]} addTypename={false}>
          <OrderMetadataDialog open={true} onClose={onCloseMock} data={mockData} />
        </CustomMockedProvider>,
        { wrapper },
      );

      const orderLineMetadata = screen.getByTestId(TEST_ID_ORDER_LINE_METADATA);
      const expandButtons = within(orderLineMetadata).getAllByTestId("expand");
      const expandButtonPrivateMetadata = expandButtons[1]; // Private metadata is second

      // Show private metadata
      fireEvent.click(expandButtonPrivateMetadata);

      // Open input to add new metadata
      const addButton = within(orderLineMetadata).getByTestId("add-field");

      fireEvent.click(addButton);

      const keyInputs = within(orderLineMetadata).getAllByTestId("metadata-key-input");
      const valueInputs = within(orderLineMetadata).getAllByTestId("metadata-value-input");
      const newKeyInput = keyInputs[keyInputs.length - 1];
      const newValueInput = valueInputs[valueInputs.length - 1];

      // Add value to new input line
      fireEvent.change(newKeyInput, { target: { value: "new-private-key" } });
      fireEvent.change(newValueInput, { target: { value: "new-private-value" } });

      // Submit the form
      await userEvent.click(screen.getByTestId("save"));

      expect(updatePrivateMetadataMock.variableMatcher).toHaveBeenCalledWith({
        id: mockData.id,
        input: [
          { key: mockData.privateMetadata[0].key, value: mockData.privateMetadata[0].value },
          { key: "new-private-key", value: "new-private-value" },
        ],
        keysToDelete: [],
      });
    });

    it("shows validation error when user inputs private metadata with the same key", async () => {
      render(
        <MockedProvider>
          <OrderMetadataDialog open={true} onClose={onCloseMock} data={mockData} />
        </MockedProvider>,
        { wrapper },
      );

      const orderLineMetadata = screen.getByTestId(TEST_ID_ORDER_LINE_METADATA);
      const expandButtons = within(orderLineMetadata).getAllByTestId("expand");
      const expandButtonPrivateMetadata = expandButtons[1];

      // Show private metadata
      fireEvent.click(expandButtonPrivateMetadata);

      // Open input to add new metadata
      const addButton = within(orderLineMetadata).getByTestId("add-field");

      fireEvent.click(addButton);

      // Add value to new input line
      const keyInputs = within(orderLineMetadata).getAllByTestId("metadata-key-input");
      const valueInputs = within(orderLineMetadata).getAllByTestId("metadata-value-input");
      const newKeyInput = keyInputs[keyInputs.length - 1]; // New input is last in order
      const newValueInput = valueInputs[valueInputs.length - 1];

      // Try to add metadata with duplicate key
      fireEvent.change(newKeyInput, { target: { value: "order-line-private-key" } }); // This key already exists
      fireEvent.change(newValueInput, { target: { value: "new-value" } });

      // Submit the form
      await userEvent.click(screen.getByTestId("save"));

      expect(
        screen.getByText("Metadata keys must be unique, remove duplicate key"),
      ).toBeInTheDocument();
    });
  });
});
