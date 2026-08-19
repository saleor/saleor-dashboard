import { AppTypeEnum } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ChannelPaymentGatewaysSection } from "./ChannelPaymentGatewaysSection";

const navigate = jest.fn();

jest.mock("@dashboard/hooks/useNavigator", () => () => navigate);

describe("ChannelPaymentGatewaysSection", () => {
  beforeEach(() => {
    navigate.mockClear();
  });

  it("shows explore extensions when no payment apps are installed", async () => {
    // Arrange
    const user = userEvent.setup();

    // Act
    render(<ChannelPaymentGatewaysSection apps={[]} />, { wrapper: Wrapper });

    // Assert
    await user.click(screen.getByTestId("payment-gateways-explore"));
    expect(navigate).toHaveBeenCalledWith("/extensions/explore?");
  });

  it("lists payment apps with configure actions", async () => {
    // Arrange
    const user = userEvent.setup();

    // Act
    render(
      <ChannelPaymentGatewaysSection
        apps={[
          {
            id: "stripe-app",
            name: "Stripe",
            isActive: true,
            type: AppTypeEnum.THIRDPARTY,
            appUrl: "https://stripe.example.com",
            logoUrl: null,
          },
        ]}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByText("Stripe")).toBeInTheDocument();
    await user.click(screen.getByTestId("payment-gateway-configure-stripe-app"));
    expect(navigate).toHaveBeenCalledWith("/extensions/app/stripe-app?");
  });
});
