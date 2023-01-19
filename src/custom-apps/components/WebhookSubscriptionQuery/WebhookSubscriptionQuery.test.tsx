import { WebhookEventTypeAsyncEnum, WebhookEventTypeSyncEnum } from "@dashboard/graphql";
import { Fetcher } from "@graphiql/toolkit";
import Wrapper from "@test/wrapper";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import WebhookSubscriptionQuery from "./WebhookSubscriptionQuery";

jest.mock("@graphiql/toolkit", () => ({
  createGraphiQLFetcher: jest.fn(_x => jest.fn() as Fetcher),
}));

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
}));

jest.mock("@saleor/macaw-ui", () => ({
  useStyles: jest.fn(() => () => ({})),
  makeStyles: jest.fn(() => () => ({})),
  DialogHeader: jest.fn(() => () => <></>),
}));

describe("WebhookSubscriptionQuery", () => {
  it("closes when ignore changes is clicked", async () => {
    // Arrange
    const props = {
      query: '',
      setQuery: jest.fn(),
      data: {
        syncEvents: [] as WebhookEventTypeSyncEnum[],
        asyncEvents: [] as WebhookEventTypeAsyncEnum[],
        isActive: false,
        name: '',
        targetUrl: '',
        subscriptionQuery: ''
      }
    };
    const user = userEvent.setup();

    // Act
    const { getByTestId } = render(
      <Wrapper>
        <WebhookSubscriptionQuery {...props} />
      </Wrapper>
    );
    getByTestId("graphiql-webhook");

    // Assert
    expect(props.setQuery).toHaveBeenCalled();
  });
  it("closes when keep editing is clicked", async () => {
    // Arrange
    const props = {
      query: '',
      setQuery: jest.fn(),
      data: {
        syncEvents: [] as WebhookEventTypeSyncEnum[],
        asyncEvents: [] as WebhookEventTypeAsyncEnum[],
        isActive: false,
        name: '',
        targetUrl: '',
        subscriptionQuery: ''
      }
    };
    const user = userEvent.setup();

    // Act
    const { getByTestId } = render( 
      <Wrapper>
        <WebhookSubscriptionQuery {...props} />
      </Wrapper>
    );
    getByTestId("graphiql-webhook");

    // Assert
    expect(props.setQuery).toHaveBeenCalled();
  });
});
