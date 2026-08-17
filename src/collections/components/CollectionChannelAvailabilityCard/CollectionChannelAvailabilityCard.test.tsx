import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { CollectionChannelAvailabilityCard } from "./CollectionChannelAvailabilityCard";

describe("CollectionChannelAvailabilityCard", () => {
  it("renders dashed empty state when no channels are assigned", () => {
    // Arrange // Act
    render(
      <CollectionChannelAvailabilityCard
        channels={[]}
        channelCurrencies={{}}
        totalChannelsCount={7}
        errors={[]}
        managePermissions={[]}
        onManageClick={jest.fn()}
        onChannelChange={jest.fn()}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByTestId("channel-availability-empty")).toBeInTheDocument();
    expect(screen.getByText("No channels assigned")).toBeInTheDocument();
    expect(
      screen.getByText("Assign channels so this collection can appear in storefronts."),
    ).toBeInTheDocument();
    expect(screen.getByTestId("channel-availability-subtitle")).toHaveTextContent(
      "Collection in 0 of 7 channels",
    );
  });

  it("renders availability card with channel subtitle", () => {
    // Arrange // Act
    render(
      <CollectionChannelAvailabilityCard
        channels={[
          {
            id: "ch-1",
            name: "Channel USD",
            isPublished: true,
            publishedAt: null,
          },
        ]}
        channelCurrencies={{ "ch-1": "USD" }}
        totalChannelsCount={2}
        errors={[]}
        managePermissions={[]}
        onManageClick={jest.fn()}
        onChannelChange={jest.fn()}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByTestId("availability-card")).toBeInTheDocument();
    expect(screen.getByTestId("channel-availability-subtitle")).toHaveTextContent(
      "Collection in 1 of 2 channels",
    );
    expect(screen.getByText("Availability")).toBeInTheDocument();
    expect(screen.queryByTestId("collection-channel-hidden-banner")).not.toBeInTheDocument();
    expect(screen.queryByTestId("collection-channel-healthy-banner")).not.toBeInTheDocument();
  });

  it("shows hidden status on channel row when a channel is not published", () => {
    // Arrange // Act
    render(
      <CollectionChannelAvailabilityCard
        channels={[
          {
            id: "ch-1",
            name: "Channel USD",
            isPublished: true,
            publishedAt: null,
          },
          {
            id: "ch-2",
            name: "Channel EUR",
            isPublished: false,
            publishedAt: null,
          },
        ]}
        channelCurrencies={{ "ch-1": "USD", "ch-2": "EUR" }}
        totalChannelsCount={2}
        errors={[]}
        managePermissions={[]}
        onManageClick={jest.fn()}
        onChannelChange={jest.fn()}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByText("Channel EUR")).toBeInTheDocument();
    expect(screen.queryByTestId("collection-channel-hidden-banner")).not.toBeInTheDocument();
  });
});
