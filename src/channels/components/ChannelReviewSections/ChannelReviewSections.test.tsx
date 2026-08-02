import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { ChannelReviewSections } from "./ChannelReviewSections";

jest.mock("@dashboard/hooks/useNavigator", () => () => jest.fn());

describe("ChannelReviewSections", () => {
  it("renders tax shortcut panel and catalog section", () => {
    // Arrange & Act
    render(
      <ChannelReviewSections
        taxConfigurationId="tax-1"
        chargeTaxes
        channel={{
          id: "channel-1",
          name: "United States",
          slug: "us",
          currencyCode: "USD",
        }}
        channelSlug="us"
        paymentAppsCount={2}
        publishedProductCount={3}
        unpublishedProductCount={2}
        listedInChannelCount={5}
        totalProductCount={128}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByTestId("channel-taxes-shortcut")).toBeInTheDocument();
    expect(screen.getByTestId("channel-catalog")).toBeInTheDocument();
    expect(screen.getByTestId("channel-taxes-shortcut-action")).toHaveTextContent("Flat rates");
    expect(screen.getByText("123")).toBeInTheDocument();
  });
});
