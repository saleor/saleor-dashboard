import { MockedProvider } from "@apollo/client/testing";
import { MessageContext } from "@dashboard/components/messages";
import { UpdateMetadataDocument } from "@dashboard/graphql";
import { useHasManageProductsPermission } from "@dashboard/orders/hooks/useHasManageProductsPermission";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
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

// Mock permissions hook
jest.mock("@dashboard/orders/hooks/useHasManageProductsPermission", () => ({
  useHasManageProductsPermission: jest.fn(() => false),
}));

// Mock useNotifier hook
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

  it("displays order line metadata", async () => {
    render(
      <MockedProvider>
        <OrderMetadataDialog open={true} onClose={onCloseMock} data={mockData} />
      </MockedProvider>,
      { wrapper },
    );

    const orderLineMetadata = screen.getByTestId(TEST_ID_ORDER_LINE_METADATA);
    const expandButtonOrderLineMetadata = within(orderLineMetadata).getAllByTestId("expand")[0];
    const expandButtonOrderLinePrivateMetadata =
      within(orderLineMetadata).getAllByTestId("expand")[1];

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

    // Hide metadata, show private metadata
    fireEvent.click(expandButtonOrderLineMetadata);
    fireEvent.click(expandButtonOrderLinePrivateMetadata);

    // Private metadata is visible, metadata is not
    expect(
      within(orderLineMetadata).getByDisplayValue("order-line-private-key"),
    ).toBeInTheDocument();
    expect(
      within(orderLineMetadata).getByDisplayValue("order-line-private-value"),
    ).toBeInTheDocument();
    expect(within(orderLineMetadata).queryByDisplayValue("order-line-key")).not.toBeInTheDocument();
    expect(
      within(orderLineMetadata).queryByDisplayValue("order-line-value"),
    ).not.toBeInTheDocument();
  });

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

  it("allows editing OrderLine metadata", async () => {
    const updateMetadataMock = {
      request: {
        query: UpdateMetadataDocument,
        variables: {
          id: mockData.id,
          input: [
            ...mockData.metadata,
            { key: "new-key", value: "new-value", __typename: "MetadataItem" },
          ],
        },
      },
      result: {
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
      <MockedProvider mocks={[updateMetadataMock]} addTypename={false}>
        <OrderMetadataDialog open={true} onClose={onCloseMock} data={mockData} />
      </MockedProvider>,
      { wrapper },
    );

    // Wait for the dialog to be rendered
    await waitFor(() => {
      expect(screen.getByTestId("save")).toBeInTheDocument();
    });

    const orderLineMetadata = screen.getByTestId(TEST_ID_ORDER_LINE_METADATA);
    const expandButtonOrderLineMetadata = within(orderLineMetadata).getAllByTestId("expand")[0];

    // Show metadata
    fireEvent.click(expandButtonOrderLineMetadata);

    // Verify existing metadata is displayed
    const existingKeyInput = within(orderLineMetadata).getByDisplayValue("order-line-key");
    const existingValueInput = within(orderLineMetadata).getByDisplayValue("order-line-value");

    expect(existingKeyInput).toBeInTheDocument();
    expect(existingValueInput).toBeInTheDocument();

    // Change a field value it marks form as dirty
    const orderLineMetadataSection = screen.getByTestId("order-line-metadata");
    const valueInput = within(orderLineMetadataSection).getByTestId("metadata-value-input");

    await userEvent.clear(valueInput);
    await userEvent.type(valueInput, "new-value");

    // The save button should be enabled since we changed a field value
    expect(screen.getByTestId("save")).toBeEnabled();

    // Submit the form
    await userEvent.click(screen.getByTestId("save"));

    // Wait for the mutation to complete
    await waitFor(() => {
      // The save button should be enabled since the form state is not reset
      expect(screen.getByTestId("save")).toBeEnabled();
      
      // Verify that the mutation was called with correct variables
      expect(updateMetadataMock.request.variables).toEqual({
        id: mockData.id,
        input: [
          ...mockData.metadata,
          { key: "new-key", value: "new-value", __typename: "MetadataItem" },
        ],
      });
    });

    // Add new metadata
    const addButton = within(orderLineMetadata).getByTestId("add-field");

    fireEvent.click(addButton);

    // Wait for new inputs to be added and get them
    await waitFor(() => {
      const keyInputs = within(orderLineMetadata).getAllByTestId("metadata-key-input");
      const valueInputs = within(orderLineMetadata).getAllByTestId("metadata-value-input");

      expect(keyInputs).toHaveLength(2); // Original + new
      expect(valueInputs).toHaveLength(2); // Original + new
    });

    const keyInputs = within(orderLineMetadata).getAllByTestId("metadata-key-input");
    const valueInputs = within(orderLineMetadata).getAllByTestId("metadata-value-input");
    const newKeyInput = keyInputs[keyInputs.length - 1];
    const newValueInput = valueInputs[valueInputs.length - 1];

    // Fill in the new metadata
    fireEvent.change(newKeyInput, { target: { value: "new-key" } });
    fireEvent.change(newValueInput, { target: { value: "new-value" } });

    // Save button should be enabled after changes
    await waitFor(() => {
      expect(screen.getByTestId("save")).toBeEnabled();
    });

    // Submit the form
    await userEvent.click(screen.getByTestId("save"));

    // Wait for the mutation to complete
    await waitFor(() => {
      // The save button should be enabled since the form state is not reset
      expect(screen.getByTestId("save")).toBeEnabled();
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

    // Verify existing metadata is displayed
    const existingKeyInput = within(orderLineMetadata).getByDisplayValue("order-line-key");

    expect(existingKeyInput).toBeInTheDocument();

    // Add new metadata
    const addButton = within(orderLineMetadata).getByTestId("add-field");

    fireEvent.click(addButton);

    // Wait for new inputs to be added and get them
    await waitFor(() => {
      const keyInputs = within(orderLineMetadata).getAllByTestId("metadata-key-input");
      const valueInputs = within(orderLineMetadata).getAllByTestId("metadata-value-input");

      expect(keyInputs).toHaveLength(2); // Original + new
      expect(valueInputs).toHaveLength(2); // Original + new
    });

    const keyInputs = within(orderLineMetadata).getAllByTestId("metadata-key-input");
    const valueInputs = within(orderLineMetadata).getAllByTestId("metadata-value-input");
    const newKeyInput = keyInputs[keyInputs.length - 1];
    const newValueInput = valueInputs[valueInputs.length - 1];

    // Try to add metadata with duplicate key
    fireEvent.change(newKeyInput, { target: { value: "order-line-key" } });
    fireEvent.change(newValueInput, { target: { value: "new-value" } });

    // Submit the form
    await userEvent.click(screen.getByTestId("save"));

    // Wait for the error message to appear
    await waitFor(() => {
      expect(
        screen.getByText("Metadata keys must be unique, remove duplicate key"),
      ).toBeInTheDocument();
    });
  });

  it("allows editing OrderLine private metadata", async () => {
    const updatePrivateMetadataMock = {
      request: {
        query: UpdateMetadataDocument,
        variables: {
          id: mockData.id,
          input: [
            ...mockData.privateMetadata,
            { key: "new-private-key", value: "new-private-value", __typename: "MetadataItem" },
          ],
        },
      },
      result: {
        data: {
          updatePrivateMetadata: {
            item: {
              privateMetadata: [
                ...mockData.privateMetadata,
                { key: "new-private-key", value: "new-private-value", __typename: "MetadataItem" },
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
      <MockedProvider mocks={[updatePrivateMetadataMock]} addTypename={false}>
        <OrderMetadataDialog open={true} onClose={onCloseMock} data={mockData} />
      </MockedProvider>,
      { wrapper },
    );

    // Wait for the dialog to be rendered
    await waitFor(() => {
      expect(screen.getByTestId("save")).toBeInTheDocument();
    });

    const orderLineMetadata = screen.getByTestId(TEST_ID_ORDER_LINE_METADATA);
    const expandButtons = within(orderLineMetadata).getAllByTestId("expand");
    const expandButtonPrivateMetadata = expandButtons[1]; // Private metadata is second

    // Show private metadata
    fireEvent.click(expandButtonPrivateMetadata);

    // Add new metadata
    const addButton = within(orderLineMetadata).getByTestId("add-field");

    fireEvent.click(addButton);

    // Wait for new inputs to be added and get them
    await waitFor(() => {
      const keyInputs = within(orderLineMetadata).getAllByTestId("metadata-key-input");
      const valueInputs = within(orderLineMetadata).getAllByTestId("metadata-value-input");

      expect(keyInputs).toHaveLength(2); // Original + new
      expect(valueInputs).toHaveLength(2); // Original + new
    });

    const keyInputs = within(orderLineMetadata).getAllByTestId("metadata-key-input");
    const valueInputs = within(orderLineMetadata).getAllByTestId("metadata-value-input");
    const newKeyInput = keyInputs[keyInputs.length - 1];
    const newValueInput = valueInputs[valueInputs.length - 1];

    // Fill in the new metadata
    fireEvent.change(newKeyInput, { target: { value: "new-private-key" } });
    fireEvent.change(newValueInput, { target: { value: "new-private-value" } });

    // Submit the form
    await userEvent.click(screen.getByTestId("save"));

    // Wait for the mutation to complete and verify it was called correctly
    await waitFor(() => {
      expect(updatePrivateMetadataMock.request.variables).toEqual({
        id: mockData.id,
        input: [
          ...mockData.privateMetadata,
          { key: "new-private-key", value: "new-private-value", __typename: "MetadataItem" },
        ],
      });
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
    const expandButtonPrivateMetadata = expandButtons[1]; // Private metadata is second

    // Show private metadata
    fireEvent.click(expandButtonPrivateMetadata);

    // Wait for private metadata section to be visible
    await waitFor(() => {
      const privateMetadataSection = within(orderLineMetadata).getByText("Private Metadata");

      expect(privateMetadataSection).toBeInTheDocument();
    });

    // Add new metadata
    const addButton = within(orderLineMetadata).getByTestId("add-field");

    fireEvent.click(addButton);

    // Wait for new inputs to be added and get them
    await waitFor(() => {
      const keyInputs = within(orderLineMetadata).getAllByTestId("metadata-key-input");
      const valueInputs = within(orderLineMetadata).getAllByTestId("metadata-value-input");

      expect(keyInputs).toHaveLength(2); // Original + new
      expect(valueInputs).toHaveLength(2); // Original + new
    });

    const keyInputs = within(orderLineMetadata).getAllByTestId("metadata-key-input");
    const valueInputs = within(orderLineMetadata).getAllByTestId("metadata-value-input");
    const newKeyInput = keyInputs[keyInputs.length - 1];
    const newValueInput = valueInputs[valueInputs.length - 1];

    // Try to add metadata with duplicate key
    fireEvent.change(newKeyInput, { target: { value: "order-line-private-key" } });
    fireEvent.change(newValueInput, { target: { value: "new-value" } });

    // Submit the form
    await userEvent.click(screen.getByTestId("save"));

    // Wait for the error message to appear
    await waitFor(() => {
      expect(
        screen.getByText("Metadata keys must be unique, remove duplicate key"),
      ).toBeInTheDocument();
    });
  });
});
