import "@testing-library/jest-dom";

import { WebhookEventTypeAsyncEnum } from "@dashboard/graphql";
import { ApolloMockedProvider } from "@test/ApolloMockedProvider";
import { render, screen } from "@testing-library/react";
import React from "react";

import DryRun from "./DryRun";

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
  DialogHeader: jest.fn(() => () => <></>),
}));

beforeEach(() => {
  window.localStorage.clear();
});

describe("DryRun", () => {
  it("is available on the webhook page", async () => {
    // Arrange
    const props = {
      query: "",
      showDialog: true,
      setShowDialog: jest.fn(),
      asyncEvents: [] as WebhookEventTypeAsyncEnum[],
      setResult: jest.fn(),
    };

    // Act
    render(
      <ApolloMockedProvider>
        <DryRun {...props} />
      </ApolloMockedProvider>,
    );

    // Assert
    expect(screen.queryByTestId("dry-run-items-list")).toBeInTheDocument();
    expect(screen.queryByTestId("graphiql-container2")).not.toBeInTheDocument();
  });
});
