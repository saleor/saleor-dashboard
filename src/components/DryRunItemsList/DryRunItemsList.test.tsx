// @ts-strict-ignore
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { ThemeProvider } from "@saleor/macaw-ui";
import { productsMocks } from "@test/mocks/products";
import { render, screen } from "@testing-library/react";

import DryRunItemsList from "./DryRunItemsList";

const mocks: MockedResponse[] = [...productsMocks];

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
}));
describe("DryRunItemsList", () => {
  it("is available on the webhook page", async () => {
    // Arrange
    const props = {
      objectId: null,
      setObjectId: jest.fn(),
      object: "PRODUCT",
    };

    // Act
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <ThemeProvider>
          <DryRunItemsList {...props} />
        </ThemeProvider>
      </MockedProvider>,
    );
    // Assert
    expect(screen.queryByTestId("dry-run-items-list")).toBeInTheDocument();
  });
});
