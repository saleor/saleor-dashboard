import { type ChannelPaymentApp } from "@dashboard/channels/hooks/useChannelPaymentApps";
import { AppTypeEnum, CircuitBreakerStateEnum } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ChannelPaymentGatewaysSection } from "./ChannelPaymentGatewaysSection";

const navigate = jest.fn();

jest.mock("@dashboard/hooks/useNavigator", () => () => navigate);

const paymentApp = (overrides: Partial<ChannelPaymentApp> = {}): ChannelPaymentApp => ({
  id: "stripe-app",
  name: "Stripe",
  isActive: true,
  type: AppTypeEnum.THIRDPARTY,
  appUrl: "https://stripe.example.com",
  logoUrl: null,
  breakerState: CircuitBreakerStateEnum.CLOSED,
  hasCriticalProblem: false,
  ...overrides,
});

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
    render(<ChannelPaymentGatewaysSection apps={[paymentApp()]} />, { wrapper: Wrapper });

    // Assert
    expect(screen.getByText("Stripe")).toBeInTheDocument();
    expect(screen.queryByTestId("payment-gateway-health-stripe-app")).not.toBeInTheDocument();
    await user.click(screen.getByTestId("payment-gateway-configure-stripe-app"));
    expect(navigate).toHaveBeenCalledWith("/extensions/app/stripe-app?");
  });

  it("shows a paused pill when the circuit breaker is open", () => {
    // Arrange & Act
    render(
      <ChannelPaymentGatewaysSection
        apps={[paymentApp({ breakerState: CircuitBreakerStateEnum.OPEN })]}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByTestId("payment-gateway-health-stripe-app")).toHaveTextContent("Paused");
  });

  it("shows an attention pill when the app has a critical problem", () => {
    // Arrange & Act
    render(<ChannelPaymentGatewaysSection apps={[paymentApp({ hasCriticalProblem: true })]} />, {
      wrapper: Wrapper,
    });

    // Assert
    expect(screen.getByTestId("payment-gateway-health-stripe-app")).toHaveTextContent("Attention");
  });
});
