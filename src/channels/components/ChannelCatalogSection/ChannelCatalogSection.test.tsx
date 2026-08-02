import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { ChannelCatalogSection } from "./ChannelCatalogSection";

const navigate = jest.fn();

jest.mock("@dashboard/hooks/useNavigator", () => () => navigate);

const RouterWrapper = ({ children }: { children: ReactNode }) => (
  <MemoryRouter>
    <Wrapper>{children}</Wrapper>
  </MemoryRouter>
);

const channel = {
  id: "Q2hhbm5lbDox",
  name: "United States",
  slug: "us",
  currencyCode: "USD",
};

describe("ChannelCatalogSection", () => {
  beforeEach(() => {
    navigate.mockClear();
  });

  it("shows not-in-channel stats and opens full product list for new channels", () => {
    // Arrange & Act
    render(
      <ChannelCatalogSection
        channel={channel}
        publishedProductCount={0}
        unpublishedProductCount={0}
        listedInChannelCount={0}
        totalProductCount={128}
        onBulkPublishCatalog={jest.fn()}
      />,
      { wrapper: RouterWrapper },
    );

    // Assert
    expect(screen.getByText("Not in channel")).toBeInTheDocument();
    expect(screen.getByText("128")).toBeInTheDocument();
    expect(screen.queryByTestId("catalog-action-unpublished")).not.toBeInTheDocument();

    expect(screen.getByTestId("catalog-action-add")).toBeInTheDocument();
  });

  it("never shows a negative not-in-channel count when the two counts disagree", () => {
    // Arrange & Act — the totals come from separate queries and can briefly disagree
    render(
      <ChannelCatalogSection
        channel={channel}
        publishedProductCount={17}
        unpublishedProductCount={3}
        listedInChannelCount={20}
        totalProductCount={12}
        onBulkPublishCatalog={jest.fn()}
      />,
      { wrapper: RouterWrapper },
    );

    // Assert
    expect(screen.getByText("Not in channel")).toBeInTheDocument();
    expect(screen.getByText("0 not in channel")).toBeInTheDocument();
  });

  it("shows warehouse guidance when the channel has no warehouses assigned", () => {
    // Arrange & Act
    render(
      <ChannelCatalogSection
        channel={channel}
        publishedProductCount={0}
        unpublishedProductCount={0}
        listedInChannelCount={0}
        totalProductCount={128}
        channelWarehouseCount={0}
        shopWarehouseCount={2}
        onBulkPublishCatalog={jest.fn()}
      />,
      { wrapper: RouterWrapper },
    );

    // Assert
    expect(
      screen.getByText(
        "Assign a warehouse to this channel so checkout can allocate inventory and you can set stock when adding products.",
      ),
    ).toBeInTheDocument();
  });

  it("shows create-warehouse guidance when the shop has no warehouses", () => {
    // Arrange & Act
    render(
      <ChannelCatalogSection
        channel={channel}
        publishedProductCount={0}
        unpublishedProductCount={0}
        listedInChannelCount={0}
        totalProductCount={128}
        channelWarehouseCount={0}
        shopWarehouseCount={0}
        onBulkPublishCatalog={jest.fn()}
      />,
      { wrapper: RouterWrapper },
    );

    // Assert
    expect(
      screen.getByText(
        "Create a warehouse before you can set stock when adding products. You can still publish products and set prices.",
      ),
    ).toBeInTheDocument();
  });

  it("shows recently published thumbnails next to the published stat", () => {
    // Arrange & Act
    render(
      <ChannelCatalogSection
        channel={channel}
        publishedProductCount={12}
        unpublishedProductCount={5}
        listedInChannelCount={17}
        totalProductCount={128}
        recentlyPublishedProducts={[
          { id: "UHJvZHVjdDox", name: "Sneaker", thumbnailUrl: "https://example.com/sneaker.jpg" },
        ]}
      />,
      { wrapper: RouterWrapper },
    );

    // Assert
    expect(screen.getByTestId("recently-published-thumbnails")).toBeInTheDocument();
    expect(screen.getByTestId("recently-published-thumbnail-UHJvZHVjdDox")).toBeInTheDocument();
  });

  it("shows channel-scoped actions when products are listed", async () => {
    // Arrange
    const user = userEvent.setup();

    // Act
    render(
      <ChannelCatalogSection
        channel={channel}
        publishedProductCount={12}
        unpublishedProductCount={5}
        listedInChannelCount={17}
        totalProductCount={128}
      />,
      { wrapper: RouterWrapper },
    );

    // Assert
    expect(screen.getByText("111")).toBeInTheDocument();
    expect(screen.getByTestId("catalog-action-unpublished")).toBeInTheDocument();

    await user.click(screen.getByTestId("catalog-action-unpublished"));
    expect(navigate).toHaveBeenCalledWith(expect.stringContaining("isPublished"));
    expect(navigate).toHaveBeenCalledWith(expect.stringContaining("false"));

    await user.click(screen.getByTestId("catalog-action-published"));
    expect(navigate).toHaveBeenCalledWith(expect.stringContaining("isPublished"));
    expect(navigate).toHaveBeenCalledWith(expect.stringContaining("true"));
  });
});
