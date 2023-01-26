import "@testing-library/jest-dom";

import { ApolloMockedProvider } from "@test/ApolloMockedProvider";
import { render, screen } from "@testing-library/react";
import React from "react";

import DryRunItemsList from "./DryRunItemsList";

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
}));

jest.mock("@saleor/macaw-ui", () => ({
  useStyles: jest.fn(() => () => ({})),
  makeStyles: jest.fn(() => () => ({})),
  useListWidths: jest.fn(() => () => ({})),
}));

describe("DryRunItemsList", () => {
  it("is available on the webhook page", async () => {
    const props = {
      objectId: null,
      setObjectId: jest.fn(),
      object: "PRODUCT",
    };

    render(
      <ApolloMockedProvider>
        <DryRunItemsList {...props} />
      </ApolloMockedProvider>,
    );

    expect(screen.queryByTestId("dry-run-items-list")).toBeInTheDocument();
    expect(screen.queryByTestId("dry-run-items-list2")).not.toBeInTheDocument();
  });
});
