import {
  WebhookEventTypeAsyncEnum,
  WebhookEventTypeSyncEnum,
} from "@dashboard/graphql";
import { Fetcher } from "@graphiql/toolkit";
import { ThemeProvider } from "@saleor/macaw-ui/next";
import { ApolloMockedProvider } from "@test/ApolloMockedProvider";
import { render, screen } from "@testing-library/react";
import React from "react";

import WebhookSubscriptionQuery from "./WebhookSubscriptionQuery";

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

beforeEach(() => {
  window.localStorage.clear();
});

describe("WebhookSubscriptionQuery", () => {
  it("is available on the webhook page", async () => {
    // Arrange
    const props = {
      query: "",
      setQuery: vi.fn(),
      data: {
        syncEvents: [] as WebhookEventTypeSyncEnum[],
        asyncEvents: [] as WebhookEventTypeAsyncEnum[],
        isActive: false,
        name: "",
        targetUrl: "",
        subscriptionQuery: "",
        customHeaders: "",
      },
    };

    // Act
    render(
      <ApolloMockedProvider>
        <ThemeProvider>
          <WebhookSubscriptionQuery {...props} />
        </ThemeProvider>
      </ApolloMockedProvider>,
    );

    // Assert
    expect(screen.queryByTestId("graphiql-container")).toBeInTheDocument();
    expect(screen.queryByTestId("graphiql-container2")).not.toBeInTheDocument();
  });
});
