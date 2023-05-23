import "@testing-library/jest-dom";

import { Fetcher } from "@graphiql/toolkit";
import { ApolloMockedProvider } from "@test/ApolloMockedProvider";
import { render, screen } from "@testing-library/react";
import React from "react";

import PermissionAlert from "./PermissionAlert";

vi.mock("@graphiql/toolkit", () => ({
  clear: vi.fn(),
  createGraphiQLFetcher: vi.fn(_x => vi.fn() as Fetcher),
}));

vi.mock("react-intl", () => ({
  useIntl: vi.fn(() => ({
    formatMessage: vi.fn(x => x.defaultMessage),
  })),
  defineMessages: vi.fn(x => x),
}));

vi.mock("@saleor/macaw-ui", () => ({
  useTheme: vi.fn(() => () => ({})),
  useStyles: vi.fn(() => () => ({})),
  makeStyles: vi.fn(() => () => ({})),
  DialogHeader: vi.fn(() => () => <></>),
}));

beforeEach(() => {
  window.localStorage.clear();
});

describe("WebhookSubscriptionQuery", () => {
  it("is available on the webhook page", async () => {
    // Arrange
    const props = {
      query: `subscription {
        event {
          ... on SaleUpdated {
            version
            sale {
              name
            }
          }
          ... on OrderCreated {
            version
            order {
              invoices {
                number
              }
            }
          }
        }
      }
      `,
    };

    render(
      <ApolloMockedProvider>
        <PermissionAlert {...props} />
      </ApolloMockedProvider>,
    );

    // FIXME async components don't work with the current setup
    // await waitFor(() => new Promise((res) => setTimeout(res, 500)))

    // Assert
    expect(screen.queryByTestId("permission-alert")).toBeInTheDocument();
  });
});
