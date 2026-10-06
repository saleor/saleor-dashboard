import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { type OrderSettingsFormData } from "../OrderSettingsPage/types";
import { OrderCheckoutStockSettings } from "./OrderCheckoutStockSettings";

const data: OrderSettingsFormData = {
  fulfillmentAutoApprove: false,
  fulfillmentAllowUnpaid: false,
  reserveStockDurationAnonymousUser: 0,
  reserveStockDurationAuthenticatedUser: 15,
  limitQuantityPerCheckout: 0,
  channels: {},
};

describe("OrderCheckoutStockSettings", () => {
  it("renders the duration input only for enabled reservations", () => {
    // Arrange & Act
    render(<OrderCheckoutStockSettings data={data} disabled={false} onChange={jest.fn()} />, {
      wrapper: Wrapper,
    });

    // Assert
    expect(screen.getByTestId("reserve-stock-duration-for-auth-user-input")).toBeInTheDocument();
    expect(screen.queryByTestId("reserve-stock-duration-for-anon-user-input")).toBeNull();
  });

  it("sets the default duration when enabled and 0 when disabled", async () => {
    // Arrange
    const onChange = jest.fn();
    const user = userEvent.setup();

    render(<OrderCheckoutStockSettings data={data} disabled={false} onChange={onChange} />, {
      wrapper: Wrapper,
    });

    // Act
    await user.click(screen.getByTestId("reserve-stock-duration-for-anon-user-checkbox"));
    await user.click(screen.getByTestId("reserve-stock-duration-for-auth-user-checkbox"));

    // Assert
    expect(onChange).toHaveBeenNthCalledWith(1, {
      target: { name: "reserveStockDurationAnonymousUser", value: 200 },
    });
    expect(onChange).toHaveBeenNthCalledWith(2, {
      target: { name: "reserveStockDurationAuthenticatedUser", value: 0 },
    });
    expect(screen.getByTestId("reserve-stock-duration-for-anon-user-input")).toBeInTheDocument();
    expect(screen.queryByTestId("reserve-stock-duration-for-auth-user-input")).toBeNull();
  });
});
