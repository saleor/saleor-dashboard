import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CustomerChangeActionEnum } from "./form";
import { OrderCustomerChangeDialog } from "./OrderCustomerChangeDialog";

describe("OrderCustomerChangeDialog", () => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
  };

  it("renders title, description, and address options", () => {
    // Arrange // Act
    render(
      <Wrapper>
        <OrderCustomerChangeDialog {...defaultProps} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByText("Changed Customer")).toBeInTheDocument();
    expect(
      screen.getByText(
        "You have changed customer assigned to this order. What would you like to do with the shipping address?",
      ),
    ).toBeInTheDocument();
    expect(screen.getByTestId("keep-address-option")).toBeInTheDocument();
    expect(screen.getByTestId("change-address-option")).toBeInTheDocument();
    expect(screen.getByTestId("submit")).toHaveTextContent("Continue");
  });

  it("submits keep address option by default", async () => {
    // Arrange
    const user = userEvent.setup();
    const onConfirm = jest.fn();

    render(
      <Wrapper>
        <OrderCustomerChangeDialog {...defaultProps} onConfirm={onConfirm} />
      </Wrapper>,
    );

    // Act
    await user.click(screen.getByTestId("submit"));

    // Assert
    expect(onConfirm).toHaveBeenCalledWith({
      changeActionOption: CustomerChangeActionEnum.KEEP_ADDRESS,
    });
  });

  it("submits change address option when selected", async () => {
    // Arrange
    const user = userEvent.setup();
    const onConfirm = jest.fn();

    render(
      <Wrapper>
        <OrderCustomerChangeDialog {...defaultProps} onConfirm={onConfirm} />
      </Wrapper>,
    );

    // Act
    await user.click(screen.getByText("Change address"));
    await user.click(screen.getByTestId("submit"));

    // Assert
    expect(onConfirm).toHaveBeenCalledWith({
      changeActionOption: CustomerChangeActionEnum.CHANGE_ADDRESS,
    });
  });
});
