import {
  type TaxConfigurationsListQuery,
  useTaxConfigurationsListQuery,
  useTaxConfigurationUpdateMutation,
} from "@dashboard/graphql";
import { taxConfigurations } from "@dashboard/taxes/fixtures";
import { fireEvent, render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";

import { taxConfigurationListUrl, type TaxesUrlQueryParams } from "../urls";
import { useCanEditTaxConfigurationMetadata } from "../utils/useCanEditTaxConfigurationMetadata";
import TaxChannelsList from "./TaxChannelsList";

const mockNavigate = jest.fn();

jest.mock("@dashboard/graphql", () => ({
  ...(jest.requireActual("@dashboard/graphql") as {}),
  useTaxConfigurationsListQuery: jest.fn(),
  useTaxConfigurationUpdateMutation: jest.fn(),
}));

jest.mock("@dashboard/hooks/useNavigator", () => ({
  __esModule: true,
  default: (): jest.Mock => mockNavigate,
}));

jest.mock("@dashboard/hooks/useNotifier/useNotifier", () => ({
  useNotifier: (): jest.Mock => jest.fn(),
}));

jest.mock("@dashboard/hooks/useShop", () => ({
  __esModule: true,
  default: (): { countries: never[] } => ({ countries: [] }),
}));

jest.mock("../utils/useCanEditTaxConfigurationMetadata", () => ({
  useCanEditTaxConfigurationMetadata: jest.fn(),
}));

// The page and the dialog have their own tests; here only what the view passes them matters.
jest.mock("../pages/TaxChannelsPage/TaxChannelsPage", () => ({
  __esModule: true,
  default: ({ onShowMetadata }: { onShowMetadata?: () => void }): React.ReactNode =>
    onShowMetadata ? (
      <button onClick={onShowMetadata}>Edit tax configuration metadata</button>
    ) : null,
}));

jest.mock("../components/TaxConfigurationMetadataDialog/TaxConfigurationMetadataDialog", () => ({
  TaxConfigurationMetadataDialog: ({
    open,
    channelName,
  }: {
    open: boolean;
    channelName: string;
  }): React.ReactNode => (open ? <div role="dialog">{`${channelName} metadata`}</div> : null),
}));

const selected = taxConfigurations[0];

const listData: TaxConfigurationsListQuery = {
  __typename: "Query",
  taxConfigurations: {
    __typename: "TaxConfigurationCountableConnection",
    edges: taxConfigurations.map(node => ({ __typename: "TaxConfigurationCountableEdge", node })),
  },
};

const mockList = (data: TaxConfigurationsListQuery | undefined): void => {
  (useTaxConfigurationsListQuery as jest.Mock).mockReturnValue({ data });
};

const renderView = (params: TaxesUrlQueryParams): void => {
  render(
    <IntlProvider defaultLocale="en" locale="en">
      <TaxChannelsList id={selected.id} params={params} />
    </IntlProvider>,
  );
};

describe("TaxChannelsList — tax configuration metadata", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useTaxConfigurationUpdateMutation as jest.Mock).mockReturnValue([
      jest.fn(),
      { status: "default", loading: false },
    ]);
    mockList(listData);
  });

  it("opens the selected channel's metadata from a link for a user who can edit it", () => {
    // Arrange
    (useCanEditTaxConfigurationMetadata as jest.Mock).mockReturnValue(true);

    // Act
    renderView({ action: "view-metadata" });

    // Assert
    expect(screen.getByRole("dialog")).toHaveTextContent(`${selected.channel.name} metadata`);
  });

  it("opens the metadata through the address when the button is clicked", () => {
    // Arrange
    (useCanEditTaxConfigurationMetadata as jest.Mock).mockReturnValue(true);
    renderView({});

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Edit tax configuration metadata" }));

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith(
      taxConfigurationListUrl(selected.id, { action: "view-metadata" }),
    );
  });

  it("neither shows the button nor opens a shared link for a user without tax permissions", () => {
    // Arrange
    (useCanEditTaxConfigurationMetadata as jest.Mock).mockReturnValue(false);

    // Act
    renderView({ action: "view-metadata" });

    // Assert
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Edit tax configuration metadata" }),
    ).not.toBeInTheDocument();
  });

  it("doesn't render the metadata dialog before the tax configurations load", () => {
    // Arrange
    (useCanEditTaxConfigurationMetadata as jest.Mock).mockReturnValue(true);
    mockList(undefined);

    // Act
    renderView({ action: "view-metadata" });

    // Assert
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
