import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { ChannelReviewSections } from "./ChannelReviewSections";

jest.mock("@dashboard/hooks/useNavigator", () => () => jest.fn());

describe("ChannelReviewSections", () => {
  it("renders tax and catalog shortcut panels as separate sections", () => {
    // Arrange & Act
    render(
      <ChannelReviewSections
        taxConfigurationId="tax-1"
        chargeTaxes
        channelSlug="us"
        paymentAppsCount={2}
        publishedProductCount={3}
        totalProductCount={128}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByTestId("channel-taxes-shortcut")).toBeInTheDocument();
    expect(screen.getByTestId("channel-catalog-shortcut")).toBeInTheDocument();
    expect(screen.getByTestId("channel-taxes-shortcut-action")).toHaveTextContent("Flat rates");
    expect(screen.getByTestId("channel-catalog-shortcut-action")).toHaveTextContent(
      "3 of 128 published",
    );
  });
});
