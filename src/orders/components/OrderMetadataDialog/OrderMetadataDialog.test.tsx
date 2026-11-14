import { InMemoryCache } from "@apollo/client";
import { MockedProvider, type MockedResponse } from "@apollo/client/testing";
import {
  OrderMetadataDocument,
  type OrderMetadataQuery,
  type OrderMetadataQueryVariables,
} from "@dashboard/graphql";
import introspectionQueryResultData from "@dashboard/graphql/fragmentTypes.generated";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { IntlProvider } from "react-intl";

import { OrderMetadataDialog } from "./OrderMetadataDialog";

const orderId = "T3JkZXI6MQ==";
const variables: OrderMetadataQueryVariables = { id: orderId };

const orderMetadata: OrderMetadataQuery = {
  __typename: "Query",
  order: {
    __typename: "Order",
    id: orderId,
    metadata: [{ __typename: "MetadataItem", key: "erp.orderId", value: "SO-1001" }],
    privateMetadata: [],
  },
};

const failedLoad: MockedResponse<OrderMetadataQuery> = {
  request: { query: OrderMetadataDocument, variables },
  error: new Error("Failed to fetch"),
};

const successfulLoad: MockedResponse<OrderMetadataQuery> = {
  request: { query: OrderMetadataDocument, variables },
  result: { data: orderMetadata },
};

const renderDialog = (mocks: MockedResponse[]): void => {
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

  render(<OrderMetadataDialog open onClose={jest.fn()} orderId={orderId} />, { wrapper: Wrapper });
};

describe("OrderMetadataDialog", () => {
  it("shows an error with Retry when the metadata fails to load, then the entries after a retry", async () => {
    // Arrange
    renderDialog([failedLoad, successfulLoad]);

    expect(await screen.findByRole("alert")).toHaveTextContent("Couldn't load metadata");
    expect(screen.queryByTestId("metadata-editor")).not.toBeInTheDocument();
    expect(screen.getByTestId("save")).toBeDisabled();

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));

    // Assert
    await waitFor(() => expect(screen.queryByRole("alert")).not.toBeInTheDocument());

    const publicEditor = (await screen.findAllByTestId("metadata-editor")).find(
      editor => editor.getAttribute("data-test-is-private") === "false",
    );

    if (!publicEditor) {
      throw new Error("No public metadata editor rendered");
    }

    fireEvent.click(within(publicEditor).getByTestId("expand"));

    expect(within(publicEditor).getByDisplayValue("SO-1001")).toBeInTheDocument();
  });

  it("shows the entries without an error when the metadata loads", async () => {
    // Arrange & Act
    renderDialog([successfulLoad]);

    // Assert
    expect(await screen.findAllByTestId("metadata-editor")).toHaveLength(2);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
