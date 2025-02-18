import { MockedProvider } from "@apollo/client/testing";
import { MessageContext } from "@dashboard/components/messages";
import { UpdateMetadataDocument } from "@dashboard/graphql";
import { useHasManageProductsPermission } from "@dashboard/orders/hooks/useHasManageProductsPermission";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import React from "react";

import { OrderMetadataDialog, OrderMetadataDialogData } from "./OrderMetadataDialog";

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

// Mock mutations
const updateMetadataMock = {
  request: {
    query: UpdateMetadataDocument,
    variables: {
      id: "order-line-id",
      metadata: [{ key: "new-key", value: "new-value" }],
    },
  },
  result: {
    data: {
      updateMetadata: {
        item: {
          metadata: [{ key: "new-key", value: "new-value" }],
          id: "order-line-id",
          __typename: "OrderLine",
        },
        errors: [],
      },
    },
  },
};

const updatePrivateMetadataMock = {
  request: {
    query: UpdateMetadataDocument,
    variables: {
      id: "order-line-id",
      privateMetadata: [{ key: "new-private-key", value: "new-private-value" }],
    },
  },
  result: {
    data: {
      updatePrivateMetadata: {
        item: {
          privateMetadata: [{ key: "new-private-key", value: "new-private-value" }],
          id: "order-line-id",
          __typename: "OrderLine",
        },
        errors: [],
      },
    },
  },
};

const mockData: OrderMetadataDialogData = {
  id: "order-line-id",
  productName: "Product Name",
  metadata: [{ key: "key", value: "value", __typename: "MetadataItem" }],
  privateMetadata: [{ key: "private-key", value: "private-value", __typename: "MetadataItem" }],
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

  it.only("displays order line and product variant metadata", async () => {
    const { debug } = render(
      <MockedProvider>
        <OrderMetadataDialog open={true} onClose={onCloseMock} data={mockData} />
      </MockedProvider>,
      { wrapper },
    );

    // Check if variant metadata is displayed
    expect(screen.getByText("Product variant metadata")).toBeInTheDocument();

    // Find the variant metadata section (it's after the divider)
    const variantSection = screen.getByText("Product variant metadata").closest("div");

    expect(variantSection).toBeTruthy();

    const metadataEditors = screen.getAllByTestId("metadata-editor");

    const orderLineMetadataEditor = metadataEditors[0];
    const productVariantMetadataEditor = metadataEditors[1];

    const expandButtonOrderLine = within(orderLineMetadataEditor).getByTestId("expand");
    const expandButtonProductVariant = within(productVariantMetadataEditor).getByTestId("expand");

    fireEvent.click(within(orderLineMetadataEditor).getByTestId("expand"));

    // Wait for the content to be visible
    await waitFor(() => {
      expect(within(orderLineMetadataEditor).getByRole("region")).toBeVisible();
    });

    screen.debug(orderLineMetadataEditor);

    // Check if the metadata is displayed
    expect(screen.getByText("variant-key")).toBeInTheDocument();
    expect(screen.getByText("variant-value")).toBeInTheDocument();
  });

  it("closes when user hits close button", () => {
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
    render(
      <MockedProvider mocks={[updateMetadataMock]} addTypename={false}>
        <OrderMetadataDialog open={true} onClose={onCloseMock} data={mockData} />
      </MockedProvider>,
      { wrapper },
    );

    await waitFor(() => {
      const saveButton = screen.getByTestId("save");

      expect(saveButton).toBeDisabled();
    });

    // Find the order line metadata section
    const orderLineSection = screen.getByText("Order line metadata").closest("div");

    expect(orderLineSection).toBeTruthy();

    // Find the metadata editor in the order line section
    const metadataEditor = screen.getByTestId("metadata-editor");

    expect(metadataEditor).toBeTruthy();

    const metadataItem = within(metadataEditor).getByTestId("metadata-item");

    const expandButton = within(metadataItem).getByTestId("expand");

    fireEvent.click(expandButton);

    // Wait for the content to be visible
    await waitFor(() => {
      expect(within(metadataItem).getByRole("region")).toBeVisible();
    });

    // Add new metadata
    const addButton = within(metadataEditor).getByTestId("add-field");

    fireEvent.click(addButton);

    // Fill in the new metadata
    const keyInput = screen.getByTestId("key-0");
    const valueInput = screen.getByTestId("value-0");

    fireEvent.change(keyInput, { target: { value: "new-key" } });
    fireEvent.change(valueInput, { target: { value: "new-value" } });

    // Save button should be enabled after changes
    expect(screen.getByTestId("save")).toBeEnabled();

    // Submit the form
    fireEvent.click(screen.getByTestId("save"));

    // Wait for the save button to be disabled after submission
    await waitFor(() => {
      expect(screen.getByTestId("save")).toBeDisabled();
    });
  });

  it("shows validation error when user inputs metadata with the same key", async () => {
    render(
      <MockedProvider>
        <OrderMetadataDialog open={true} onClose={onCloseMock} data={mockData} />
      </MockedProvider>,
      { wrapper },
    );

    // Find the order line metadata section
    const orderLineSection = screen.getByText("Order line metadata").closest("div");

    expect(orderLineSection).toBeTruthy();

    // Find the metadata editor in the order line section
    const metadataEditor = screen.getByTestId("metadata-editor");

    expect(metadataEditor).toBeTruthy();

    const metadataItem = within(metadataEditor).getByTestId("metadata-item");

    const expandButton = within(metadataItem).getByTestId("expand");

    fireEvent.click(expandButton);

    // Wait for the content to be visible
    await waitFor(() => {
      expect(within(metadataItem).getByRole("region")).toBeVisible();
    });

    // Add new metadata
    const addButton = within(metadataEditor).getByTestId("add-field");

    fireEvent.click(addButton);

    // Fill in the new metadata with duplicate key
    const keyInput = screen.getByTestId("key-0");
    const valueInput = screen.getByTestId("value-0");

    fireEvent.change(keyInput, { target: { value: "key" } });
    fireEvent.change(valueInput, { target: { value: "new-value" } });

    // Submit the form
    fireEvent.click(screen.getByTestId("save"));

    // Wait for the error message to appear
    await waitFor(() => {
      expect(
        screen.getByText("Metadata keys must be unique, remove duplicate key"),
      ).toBeInTheDocument();
    });
  });

  it("allows editing OrderLine private metadata", async () => {
    render(
      <MockedProvider mocks={[updatePrivateMetadataMock]} addTypename={false}>
        <OrderMetadataDialog open={true} onClose={onCloseMock} data={mockData} />
      </MockedProvider>,
      { wrapper },
    );

    await waitFor(() => {
      const saveButton = screen.getByTestId("save");

      expect(saveButton).toBeDisabled();
    });

    // Find the order line metadata section
    const orderLineSection = screen.getByText("Order line metadata").closest("div");

    expect(orderLineSection).toBeTruthy();

    // Find the metadata editor in the order line section
    const metadataEditor = screen.getAllByTestId("metadata-editor")[1];

    expect(metadataEditor).toBeTruthy();

    const metadataItem = within(metadataEditor).getByTestId("metadata-item");

    const expandButton = within(metadataItem).getByTestId("expand");

    fireEvent.click(expandButton);

    // Wait for the content to be visible
    await waitFor(() => {
      expect(within(metadataItem).getByRole("region")).toBeVisible();
    });

    // Add new metadata
    const addButton = within(metadataEditor).getByTestId("add-field");

    fireEvent.click(addButton);

    // Fill in the new metadata
    const keyInput = screen.getByTestId("key-0");
    const valueInput = screen.getByTestId("value-0");

    fireEvent.change(keyInput, { target: { value: "new-private-key" } });
    fireEvent.change(valueInput, { target: { value: "new-private-value" } });

    // Save button should be enabled after changes
    expect(screen.getByTestId("save")).toBeEnabled();

    // Submit the form
    fireEvent.click(screen.getByTestId("save"));

    // Wait for the save button to be disabled after submission
    await waitFor(() => {
      expect(screen.getByTestId("save")).toBeDisabled();
    });
  });

  it("shows validation error when user inputs private metadata with the same key", async () => {
    render(
      <MockedProvider>
        <OrderMetadataDialog open={true} onClose={onCloseMock} data={mockData} />
      </MockedProvider>,
      { wrapper },
    );

    // Find the order line metadata section
    const orderLineSection = screen.getByText("Order line metadata").closest("div");

    expect(orderLineSection).toBeTruthy();

    // Find the metadata editor in the order line section
    const metadataEditor = screen.getAllByTestId("metadata-editor")[1];

    expect(metadataEditor).toBeTruthy();

    const metadataItem = within(metadataEditor).getByTestId("metadata-item");

    const expandButton = within(metadataItem).getByTestId("expand");

    fireEvent.click(expandButton);

    // Wait for the content to be visible
    await waitFor(() => {
      expect(within(metadataItem).getByRole("region")).toBeVisible();
    });

    // Add new metadata
    const addButton = within(metadataEditor).getByTestId("add-field");

    fireEvent.click(addButton);

    // Fill in the new metadata with duplicate key
    const keyInput = screen.getByTestId("key-0");
    const valueInput = screen.getByTestId("value-0");

    fireEvent.change(keyInput, { target: { value: "private-key" } });
    fireEvent.change(valueInput, { target: { value: "new-value" } });

    // Submit the form
    fireEvent.click(screen.getByTestId("save"));

    // Wait for the error message to appear
    await waitFor(() => {
      expect(
        screen.getByText("Metadata keys must be unique, remove duplicate key"),
      ).toBeInTheDocument();
    });
  });
});
