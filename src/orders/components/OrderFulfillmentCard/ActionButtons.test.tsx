import { FulfillmentStatus } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { ActionButtons } from "./ActionButtons";

jest.mock("@dashboard/hooks/useNavigator", () => () => jest.fn());

describe("ActionButtons", () => {
  const defaultProps = {
    trackingNumber: undefined,
    orderIsPaid: true,
    fulfillmentAllowUnpaid: false,
    onTrackingCodeAdd: jest.fn(),
    onApprove: jest.fn(),
  };

  it("disables approve when order is unpaid and unpaid fulfillment is not allowed", () => {
    // Arrange // Act
    render(
      <Wrapper>
        <ActionButtons
          {...defaultProps}
          status={FulfillmentStatus.WAITING_FOR_APPROVAL}
          orderIsPaid={false}
        />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByRole("button", { name: "Approve" })).toBeDisabled();
  });
});
