import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { ShippingMethodChannelAvailabilityCard } from "./ShippingMethodChannelAvailabilityCard";

describe("ShippingMethodChannelAvailabilityCard", () => {
  it("renders availability card with channel subtitle", () => {
    // Arrange // Act
    render(
      <ShippingMethodChannelAvailabilityCard
        channels={[
          {
            id: "ch-1",
            name: "Channel USD",
            currency: "USD",
            price: "10",
            minValue: "",
            maxValue: "",
          },
        ]}
        totalChannelsCount={2}
        errors={[]}
        managePermissions={[]}
        onManageClick={jest.fn()}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByTestId("availability-card")).toBeInTheDocument();
    expect(screen.getByTestId("channel-availability-subtitle")).toBeInTheDocument();
    expect(screen.getByText("Availability")).toBeInTheDocument();
    expect(screen.queryByTestId("channel-search-input")).not.toBeInTheDocument();
    expect(screen.getByTestId("channel-availability-icon")).toBeInTheDocument();
  });

  it("shows search when there are more than five channels", () => {
    // Arrange
    const channels = Array.from({ length: 6 }, (_, index) => ({
      id: `ch-${index}`,
      name: `Channel ${index}`,
      currency: "USD",
      price: "10",
      minValue: "",
      maxValue: "",
    }));

    // Act
    render(
      <ShippingMethodChannelAvailabilityCard
        channels={channels}
        totalChannelsCount={6}
        errors={[]}
        managePermissions={[]}
        onManageClick={jest.fn()}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByTestId("channel-search-input")).toBeInTheDocument();
  });

  it("shows draft badge for newly added channel without price", () => {
    // Arrange // Act
    render(
      <ShippingMethodChannelAvailabilityCard
        channels={[
          {
            id: "ch-1",
            name: "Japan",
            currency: "JPY",
            price: "",
            minValue: "",
            maxValue: "",
          },
        ]}
        savedChannelIds={[]}
        totalChannelsCount={1}
        errors={[]}
        managePermissions={[]}
        onManageClick={jest.fn()}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByText("Draft")).toBeInTheDocument();
    expect(screen.queryByText("Error")).not.toBeInTheDocument();
    expect(screen.getByTestId("shipping-channel-draft-banner")).toBeInTheDocument();
  });

  it("shows error badge for saved channel without price", () => {
    // Arrange // Act
    render(
      <ShippingMethodChannelAvailabilityCard
        channels={[
          {
            id: "ch-1",
            name: "Japan",
            currency: "JPY",
            price: "",
            minValue: "",
            maxValue: "",
          },
        ]}
        savedChannelIds={["ch-1"]}
        totalChannelsCount={1}
        errors={[]}
        managePermissions={[]}
        onManageClick={jest.fn()}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByTestId("shipping-channel-missing-price-banner")).toBeInTheDocument();
  });

  it("shows draft banner when newly added channel has no price", () => {
    // Arrange // Act
    render(
      <ShippingMethodChannelAvailabilityCard
        channels={[
          {
            id: "ch-1",
            name: "Channel USD",
            currency: "USD",
            price: "",
            minValue: "",
            maxValue: "",
          },
        ]}
        totalChannelsCount={1}
        errors={[]}
        managePermissions={[]}
        onManageClick={jest.fn()}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByTestId("shipping-channel-draft-banner")).toBeInTheDocument();
  });

  it("shows error badge when newly added channel had price entered then cleared", () => {
    // Arrange // Act
    render(
      <ShippingMethodChannelAvailabilityCard
        channels={[
          {
            id: "ch-1",
            name: "Japan",
            currency: "JPY",
            price: "",
            minValue: "",
            maxValue: "",
          },
        ]}
        savedChannelIds={[]}
        pricedChannelIds={["ch-1"]}
        totalChannelsCount={1}
        errors={[]}
        managePermissions={[]}
        onManageClick={jest.fn()}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.queryByText("Draft")).not.toBeInTheDocument();
    expect(screen.getByTestId("shipping-channel-missing-price-banner")).toBeInTheDocument();
  });

  it("renders loading skeleton when isLoading is true", () => {
    // Arrange // Act
    render(
      <ShippingMethodChannelAvailabilityCard
        channels={[]}
        totalChannelsCount={2}
        errors={[]}
        isLoading
        managePermissions={[]}
        onManageClick={jest.fn()}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.queryByTestId("channel-availability-subtitle")).not.toBeInTheDocument();
    expect(
      screen.queryByText("This shipping rate is not available in any channel"),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("availability-card")).toBeInTheDocument();
  });
});
