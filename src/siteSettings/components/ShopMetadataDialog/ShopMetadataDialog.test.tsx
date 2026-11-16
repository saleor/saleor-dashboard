import { InMemoryCache } from "@apollo/client";
import { MockedProvider, type MockedResponse } from "@apollo/client/testing";
import { ShopMetadataDocument, type ShopMetadataQuery } from "@dashboard/graphql";
import introspectionQueryResultData from "@dashboard/graphql/fragmentTypes.generated";
import { allPermissions } from "@dashboard/hooks/makeQuery";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { IntlProvider } from "react-intl";

import { createShopMetadata } from "./fixtures";
import { ShopMetadataDialog } from "./ShopMetadataDialog";

type ShopMetadataMock = MockedResponse<ShopMetadataQuery> & {
  result: jest.Mock<{ data: ShopMetadataQuery }>;
};

const createShopMetadataMock = (legalName: string): ShopMetadataMock => ({
  // Generated query hooks send a PERMISSION_* variable for every permission.
  request: { query: ShopMetadataDocument, variables: allPermissions },
  result: jest.fn(() => ({ data: createShopMetadata(legalName) })),
});

const renderDialog = ({
  open,
  mocks,
}: {
  open: boolean;
  mocks: Array<MockedResponse<ShopMetadataQuery>>;
}): { setOpen: (open: boolean) => void } => {
  // possibleTypes lets the `...Metadata` fragment (on ObjectWithMetadata) match Shop,
  // like in the app's client.
  const cache = new InMemoryCache({ possibleTypes: introspectionQueryResultData.possibleTypes });
  const Wrapper = ({ children }: { children: ReactNode }): React.ReactNode => (
    <MockedProvider mocks={mocks} cache={cache}>
      <IntlProvider defaultLocale="en" locale="en">
        <ThemeProvider>{children}</ThemeProvider>
      </IntlProvider>
    </MockedProvider>
  );
  const { rerender } = render(<ShopMetadataDialog open={open} onClose={jest.fn()} />, {
    wrapper: Wrapper,
  });

  return {
    setOpen: nextOpen => rerender(<ShopMetadataDialog open={nextOpen} onClose={jest.fn()} />),
  };
};

const metadataEditor = (isPrivate: boolean): HTMLElement => {
  const editor = screen
    .getAllByTestId("metadata-editor")
    .find(element => element.getAttribute("data-test-is-private") === String(isPrivate));

  if (!editor) {
    throw new Error(`No ${isPrivate ? "private" : "public"} metadata editor rendered`);
  }

  return editor;
};

const waitForLoadedEntries = async (): Promise<void> => {
  // Loading placeholders share the editors' test id; real editors have expand buttons.
  await waitFor(() => {
    expect(screen.queryByTestId("skeleton")).not.toBeInTheDocument();
    expect(screen.getAllByTestId("expand")).toHaveLength(2);
  });
  fireEvent.click(within(metadataEditor(false)).getByTestId("expand"));
  fireEvent.click(within(metadataEditor(true)).getByTestId("expand"));
};

describe("ShopMetadataDialog", () => {
  it("does not fetch shop metadata while closed", () => {
    // Arrange
    const mock = createShopMetadataMock("Example GmbH");

    // Act
    renderDialog({ open: false, mocks: [mock] });

    // Assert
    expect(screen.queryByText("Store Metadata")).not.toBeInTheDocument();
    expect(mock.result).not.toHaveBeenCalled();
  });

  it("shows skeletons until the shop metadata loads, then the public and private entries", async () => {
    // Arrange
    const mock = createShopMetadataMock("Example GmbH");

    // Act
    renderDialog({ open: true, mocks: [mock] });

    // Assert
    expect(screen.getByText("Store Metadata")).toBeInTheDocument();
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);

    await waitForLoadedEntries();

    expect(mock.result).toHaveBeenCalledTimes(1);
    expect(within(metadataEditor(false)).getByDisplayValue("seller.legalName")).toBeInTheDocument();
    expect(within(metadataEditor(false)).getByDisplayValue("Example GmbH")).toBeInTheDocument();
    expect(within(metadataEditor(true)).getByDisplayValue("carrier.ioss")).toBeInTheDocument();
    expect(within(metadataEditor(true)).queryByDisplayValue("seller.legalName")).toBeNull();
  });

  it("loads the latest metadata when reopened instead of showing what it loaded before", async () => {
    // Arrange
    const firstLoad = createShopMetadataMock("Example GmbH");
    const secondLoad = createShopMetadataMock("Example AG");
    const { setOpen } = renderDialog({ open: true, mocks: [firstLoad, secondLoad] });

    await waitForLoadedEntries();
    setOpen(false);

    // Act
    setOpen(true);

    // Assert
    expect(screen.queryByDisplayValue("Example GmbH")).not.toBeInTheDocument();
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);

    await waitForLoadedEntries();

    expect(secondLoad.result).toHaveBeenCalledTimes(1);
    expect(within(metadataEditor(false)).getByDisplayValue("Example AG")).toBeInTheDocument();
  });

  it("shows an error with Retry when the metadata fails to load, then the entries after a retry", async () => {
    // Arrange
    const failedLoad: MockedResponse<ShopMetadataQuery> = {
      request: { query: ShopMetadataDocument, variables: allPermissions },
      error: new Error("Failed to fetch"),
    };
    const retryLoad = createShopMetadataMock("Example GmbH");

    renderDialog({ open: true, mocks: [failedLoad, retryLoad] });

    expect(await screen.findByRole("alert")).toHaveTextContent("Couldn't load metadata");
    expect(screen.queryByTestId("metadata-editor")).not.toBeInTheDocument();

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));

    // Assert
    await waitForLoadedEntries();

    expect(retryLoad.result).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(within(metadataEditor(false)).getByDisplayValue("Example GmbH")).toBeInTheDocument();
  });
});
