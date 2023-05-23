import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { WebhookEventTypeSyncEnum } from "@dashboard/graphql";
import { ThemeProvider } from "@saleor/macaw-ui";
import productsMocks from "@test/mocks/products";
import { render, screen } from "@testing-library/react";
import React from "react";

import DryRun from "./DryRun";

const mocks: MockedResponse[] = [...productsMocks];

vi.mock("react-intl", () => ({
  useIntl: vi.fn(() => ({
    formatMessage: vi.fn(x => x.defaultMessage),
  })),
  defineMessages: vi.fn(x => x),
}));

describe("DryRun", () => {
  it("Dialog is available on the webhook page", async () => {
    // Arrange
    const props = {
      query: "",
      showDialog: true,
      setShowDialog: vi.fn(),
      setResult: vi.fn(),
      syncEvents: [] as WebhookEventTypeSyncEnum[],
    };

    // Act
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ThemeProvider>
          <DryRun {...props} />
        </ThemeProvider>
      </MockedProvider>,
    );

    // Assert
    expect(screen.queryByTestId("dry-run")).toBeInTheDocument();
  });
});
