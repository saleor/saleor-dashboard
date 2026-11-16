import { InMemoryCache } from "@apollo/client";
import { MockedProvider, type MockedResponse } from "@apollo/client/testing";
import {
  TaxConfigurationMetadataDocument,
  type TaxConfigurationMetadataQuery,
  type TaxConfigurationMetadataQueryVariables,
} from "@dashboard/graphql";
import introspectionQueryResultData from "@dashboard/graphql/fragmentTypes.generated";
import { allPermissions } from "@dashboard/hooks/makeQuery";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import {
  fireEvent,
  render,
  type RenderResult,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import type { ReactNode } from "react";
import { IntlProvider } from "react-intl";

import { createTaxConfigurationMetadata, taxConfigurationId } from "./fixtures";
import { TaxConfigurationMetadataDialog } from "./TaxConfigurationMetadataDialog";

const variables: TaxConfigurationMetadataQueryVariables = { id: taxConfigurationId };

// Generated query hooks send a PERMISSION_* variable for every permission.
const request = {
  query: TaxConfigurationMetadataDocument,
  variables: { ...variables, ...allPermissions },
};

type TaxConfigurationMetadataMock = MockedResponse<TaxConfigurationMetadataQuery> & {
  result: jest.Mock<{ data: TaxConfigurationMetadataQuery }>;
};

const createTaxConfigurationMetadataMock = (
  taxProfile = "EU-standard",
): TaxConfigurationMetadataMock => ({
  request,
  result: jest.fn(() => ({ data: createTaxConfigurationMetadata(taxProfile) })),
});

// The view renders the dialog once the selected channel's tax configuration is known.
interface SelectedTaxConfiguration {
  id: string;
  channelName: string;
}

const selectedChannelEur: SelectedTaxConfiguration = {
  id: taxConfigurationId,
  channelName: "Channel EUR",
};

const renderDialog = ({
  open,
  mock,
  selected,
}: {
  open: boolean;
  mock: MockedResponse | MockedResponse[];
  selected: SelectedTaxConfiguration;
}): RenderResult => {
  const Wrapper = ({ children }: { children: ReactNode }): React.ReactNode => (
    // possibleTypes lets the `...Metadata` fragment (on ObjectWithMetadata) match
    // TaxConfiguration, like in the app's client.
    <MockedProvider
      mocks={Array.isArray(mock) ? mock : [mock]}
      cache={new InMemoryCache({ possibleTypes: introspectionQueryResultData.possibleTypes })}
    >
      <IntlProvider defaultLocale="en" locale="en">
        <ThemeProvider>{children}</ThemeProvider>
      </IntlProvider>
    </MockedProvider>
  );

  return render(
    <TaxConfigurationMetadataDialog
      open={open}
      onClose={jest.fn()}
      taxConfigurationId={selected.id}
      channelName={selected.channelName}
    />,
    { wrapper: Wrapper },
  );
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

describe("TaxConfigurationMetadataDialog", () => {
  it("does not fetch tax configuration metadata while closed", () => {
    // Arrange
    const mock = createTaxConfigurationMetadataMock();

    // Act
    renderDialog({ open: false, mock, selected: selectedChannelEur });

    // Assert
    expect(screen.queryByText(/Tax Configuration Metadata/)).not.toBeInTheDocument();
    expect(mock.result).not.toHaveBeenCalled();
  });

  it("shows skeletons until the selected channel's metadata loads, then the public and private entries", async () => {
    // Arrange
    const mock = createTaxConfigurationMetadataMock();

    // Act
    renderDialog({ open: true, mock, selected: selectedChannelEur });

    // Assert
    expect(screen.getByText("Tax Configuration Metadata: Channel EUR")).toBeInTheDocument();
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);

    await waitForLoadedEntries();

    expect(mock.result).toHaveBeenCalledTimes(1);
    expect(within(metadataEditor(false)).getByDisplayValue("erp.taxProfile")).toBeInTheDocument();
    expect(within(metadataEditor(false)).getByDisplayValue("EU-standard")).toBeInTheDocument();
    expect(
      within(metadataEditor(true)).getByDisplayValue("avalara.companyCode"),
    ).toBeInTheDocument();
    expect(within(metadataEditor(true)).queryByDisplayValue("erp.taxProfile")).toBeNull();
  });

  it("loads the latest metadata when reopened instead of showing what it loaded before", async () => {
    // Arrange
    const firstLoad = createTaxConfigurationMetadataMock("EU-standard");
    const secondLoad = createTaxConfigurationMetadataMock("EU-reduced");
    const { rerender } = renderDialog({
      open: true,
      selected: selectedChannelEur,
      mock: [firstLoad, secondLoad],
    });

    await waitForLoadedEntries();
    rerender(
      <TaxConfigurationMetadataDialog
        open={false}
        onClose={jest.fn()}
        taxConfigurationId={selectedChannelEur.id}
        channelName={selectedChannelEur.channelName}
      />,
    );

    // Act
    rerender(
      <TaxConfigurationMetadataDialog
        open
        onClose={jest.fn()}
        taxConfigurationId={selectedChannelEur.id}
        channelName={selectedChannelEur.channelName}
      />,
    );

    // Assert
    expect(screen.queryByDisplayValue("EU-standard")).not.toBeInTheDocument();
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);

    await waitForLoadedEntries();

    expect(secondLoad.result).toHaveBeenCalledTimes(1);
    expect(within(metadataEditor(false)).getByDisplayValue("EU-reduced")).toBeInTheDocument();
  });

  it("shows an error with Retry when the metadata fails to load, then the entries after a retry", async () => {
    // Arrange
    const failedLoad: MockedResponse<TaxConfigurationMetadataQuery> = {
      request,
      error: new Error("Failed to fetch"),
    };
    const retryLoad = createTaxConfigurationMetadataMock("EU-standard");

    renderDialog({ open: true, mock: [failedLoad, retryLoad], selected: selectedChannelEur });

    expect(await screen.findByRole("alert")).toHaveTextContent("Couldn't load metadata");
    expect(screen.queryByTestId("skeleton")).not.toBeInTheDocument();
    expect(screen.queryByTestId("metadata-editor")).not.toBeInTheDocument();

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));

    // Assert
    await waitForLoadedEntries();

    expect(retryLoad.result).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(within(metadataEditor(false)).getByDisplayValue("EU-standard")).toBeInTheDocument();
  });

  it("shows an error instead of skeletons when the selected tax configuration no longer exists", async () => {
    // Arrange
    const missingConfiguration: MockedResponse<TaxConfigurationMetadataQuery> = {
      request,
      result: { data: { __typename: "Query", taxConfiguration: null } },
    };

    // Act
    renderDialog({ open: true, mock: missingConfiguration, selected: selectedChannelEur });

    // Assert
    expect(await screen.findByRole("alert")).toHaveTextContent("Couldn't load metadata");
    expect(screen.queryByTestId("skeleton")).not.toBeInTheDocument();
    expect(screen.queryByTestId("metadata-editor")).not.toBeInTheDocument();
  });
});
