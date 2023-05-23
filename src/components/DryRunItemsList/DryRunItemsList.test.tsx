import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { ThemeProvider } from "@saleor/macaw-ui";
import { productsMocks } from "@test/mocks/products";
import { render, screen } from "@testing-library/react";
import React from "react";

import DryRunItemsList from "./DryRunItemsList";

const mocks: MockedResponse[] = [...productsMocks];

vi.mock("react-intl", () => ({
  useIntl: vi.fn(() => ({
    formatMessage: vi.fn(x => x.defaultMessage),
  })),
  defineMessages: vi.fn(x => x),
}));

describe("DryRunItemsList", () => {
  it("is available on the webhook page", async () => {
    // Arrange
    const props = {
      objectId: null,
      setObjectId: vi.fn(),
      object: "PRODUCT",
    };

    // Act
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ThemeProvider>
          <DryRunItemsList {...props} />
        </ThemeProvider>
      </MockedProvider>,
    );

    // Assert
    expect(screen.queryByTestId("dry-run-items-list")).toBeInTheDocument();
  });
});
