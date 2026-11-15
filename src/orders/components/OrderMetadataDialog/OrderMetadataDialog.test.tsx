import { InMemoryCache } from "@apollo/client";
import { MockedProvider, type MockedResponse } from "@apollo/client/testing";
import {
  OrderMetadataDocument,
  type OrderMetadataQuery,
  UpdateMetadataDocument,
  type UpdateMetadataMutation,
  type UpdateMetadataMutationVariables,
} from "@dashboard/graphql";
import introspectionQueryResultData from "@dashboard/graphql/fragmentTypes.generated";
import { allPermissions } from "@dashboard/hooks/makeQuery";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { IntlProvider } from "react-intl";

import { OrderMetadataDialog } from "./OrderMetadataDialog";

const orderId = "T3JkZXI6MQ==";
// Generated query hooks send a PERMISSION_* variable for every permission.
const orderMetadataRequest = {
  query: OrderMetadataDocument,
  variables: { id: orderId, ...allPermissions },
};

const createOrderMetadata = (erpOrderId: string): OrderMetadataQuery => ({
  __typename: "Query",
  order: {
    __typename: "Order",
    id: orderId,
    metadata: [{ __typename: "MetadataItem", key: "erp.orderId", value: erpOrderId }],
    privateMetadata: [],
  },
});

const loads = (erpOrderId: string, delay?: number): MockedResponse<OrderMetadataQuery> => ({
  request: orderMetadataRequest,
  result: { data: createOrderMetadata(erpOrderId) },
  delay,
});

const failedLoad: MockedResponse<OrderMetadataQuery> = {
  request: orderMetadataRequest,
  error: new Error("Failed to fetch"),
};

const renderDialog = (
  mocks: MockedResponse[],
  onClose = jest.fn(),
): { setOpen: (open: boolean) => void; showOrder: (id: string) => void } => {
  // possibleTypes lets the `...Metadata` fragment (on ObjectWithMetadata) match Order,
  // like in the app's client.
  const cache = new InMemoryCache({ possibleTypes: introspectionQueryResultData.possibleTypes });
  const Wrapper = ({ children }: { children: ReactNode }): React.ReactNode => (
    <MockedProvider mocks={mocks} cache={cache}>
      <IntlProvider defaultLocale="en" locale="en">
        <ThemeProvider>{children}</ThemeProvider>
      </IntlProvider>
    </MockedProvider>
  );

  const { rerender } = render(<OrderMetadataDialog open onClose={onClose} orderId={orderId} />, {
    wrapper: Wrapper,
  });

  return {
    setOpen: open =>
      rerender(<OrderMetadataDialog open={open} onClose={onClose} orderId={orderId} />),
    showOrder: id => rerender(<OrderMetadataDialog open onClose={onClose} orderId={id} />),
  };
};

const publicEditor = async (): Promise<HTMLElement> => {
  // The loading placeholders share the editors' test id, so wait for them to go first.
  await waitFor(() => expect(screen.queryByTestId("skeleton")).not.toBeInTheDocument(), {
    timeout: 3000,
  });

  const editor = (await screen.findAllByTestId("metadata-editor")).find(
    element => element.getAttribute("data-test-is-private") === "false",
  );

  if (!editor) {
    throw new Error("No public metadata editor rendered");
  }

  return editor;
};

describe("OrderMetadataDialog", () => {
  it("shows the entries without an error when the metadata loads", async () => {
    // Arrange & Act
    renderDialog([loads("SO-1001")]);

    // Assert
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);
    fireEvent.click(within(await publicEditor()).getByTestId("expand"));
    expect(screen.getByDisplayValue("SO-1001")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows an error with Retry when the metadata fails to load, loading while retrying", async () => {
    // Arrange
    // The retried load answers slowly enough to see it running.
    renderDialog([failedLoad, loads("SO-1001", 500)]);

    expect(await screen.findByRole("alert")).toHaveTextContent("Couldn't load metadata");
    expect(screen.getByTestId("save")).toBeDisabled();

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));

    // Assert
    expect(await screen.findAllByTestId("skeleton")).not.toHaveLength(0);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    fireEvent.click(within(await publicEditor()).getByTestId("expand"));

    expect(screen.getByDisplayValue("SO-1001")).toBeInTheDocument();
  });

  it("shows the error instead of loading forever when the order isn't found", async () => {
    // Arrange & Act
    renderDialog([
      { request: orderMetadataRequest, result: { data: { __typename: "Query", order: null } } },
    ]);

    // Assert
    expect(await screen.findByRole("alert")).toHaveTextContent("Couldn't load metadata");
    expect(screen.queryByTestId("skeleton")).not.toBeInTheDocument();
  });

  it("keeps showing the entries while reloading after a save, then closes", async () => {
    // Arrange
    const onClose = jest.fn();
    const saveVariables: UpdateMetadataMutationVariables = {
      id: orderId,
      input: [{ key: "erp.orderId", value: "SO-2002" }],
      keysToDelete: [],
    };
    const saved: UpdateMetadataMutation = {
      __typename: "Mutation",
      updateMetadata: {
        __typename: "UpdateMetadata",
        errors: [],
        item: createOrderMetadata("SO-2002").order,
      },
      deleteMetadata: {
        __typename: "DeleteMetadata",
        errors: [],
        item: createOrderMetadata("SO-2002").order,
      },
    };

    const saveResult = jest.fn(() => ({ data: saved }));

    renderDialog(
      [
        loads("SO-1001"),
        {
          request: { query: UpdateMetadataDocument, variables: saveVariables },
          result: saveResult,
        },
        loads("SO-2002", 800),
      ],
      onClose,
    );
    fireEvent.click(within(await publicEditor()).getByTestId("expand"));
    fireEvent.change(screen.getByDisplayValue("SO-1001"), { target: { value: "SO-2002" } });

    // Act
    fireEvent.click(screen.getByTestId("save"));

    // Assert: the save has answered and the reload is still running.
    await waitFor(() => expect(saveResult).toHaveBeenCalledTimes(1));
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(onClose).not.toHaveBeenCalled();
    expect(screen.queryByTestId("skeleton")).not.toBeInTheDocument();
    expect(screen.getByDisplayValue("SO-2002")).toBeInTheDocument();
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1), { timeout: 3000 });
  });

  it("shows the error, not the values from the last open, when loading fails on reopening", async () => {
    // Arrange
    const { setOpen } = renderDialog([loads("SO-1001"), failedLoad]);

    fireEvent.click(within(await publicEditor()).getByTestId("expand"));
    expect(screen.getByDisplayValue("SO-1001")).toBeInTheDocument();
    setOpen(false);

    // Act
    setOpen(true);

    // Assert
    expect(await screen.findByRole("alert")).toHaveTextContent("Couldn't load metadata");
    expect(screen.queryByDisplayValue("SO-1001")).not.toBeInTheDocument();
    expect(screen.getByTestId("save")).toBeDisabled();
  });

  it("loads another order's metadata instead of showing the previous one's when the order changes", async () => {
    // Arrange
    const otherOrderId = "T3JkZXI6Mg==";
    const otherOrder: OrderMetadataQuery = {
      __typename: "Query",
      order: {
        __typename: "Order",
        id: otherOrderId,
        metadata: [{ __typename: "MetadataItem", key: "erp.orderId", value: "SO-2002" }],
        privateMetadata: [],
      },
    };
    const { showOrder } = renderDialog([
      loads("SO-1001"),
      {
        request: {
          query: OrderMetadataDocument,
          variables: { id: otherOrderId, ...allPermissions },
        },
        result: { data: otherOrder },
        delay: 300,
      },
    ]);

    fireEvent.click(within(await publicEditor()).getByTestId("expand"));
    expect(screen.getByDisplayValue("SO-1001")).toBeInTheDocument();

    // Act
    showOrder(otherOrderId);

    // Assert
    expect(screen.queryByDisplayValue("SO-1001")).not.toBeInTheDocument();
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);

    fireEvent.click(within(await publicEditor()).getByTestId("expand"));

    expect(screen.getByDisplayValue("SO-2002")).toBeInTheDocument();
  });
});
