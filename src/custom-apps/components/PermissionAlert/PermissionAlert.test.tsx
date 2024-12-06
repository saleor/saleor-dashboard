import "@testing-library/jest-dom";

import { Fetcher } from "@graphiql/toolkit";
import { ApolloMockedProvider } from "@test/ApolloMockedProvider";
import { render, screen } from "@testing-library/react";

import PermissionAlert from "./PermissionAlert";

jest.mock("@graphiql/toolkit", () => ({
  clear: jest.fn(),
  createGraphiQLFetcher: jest.fn(_x => jest.fn() as Fetcher),
}));
jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
}));
jest.mock("@saleor/macaw-ui", () => ({
  useTheme: jest.fn(() => () => ({})),
  useStyles: jest.fn(() => () => ({})),
  makeStyles: jest.fn(() => () => ({})),
  // eslint-disable-next-line react/display-name
  DialogHeader: jest.fn(() => () => <></>),
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
