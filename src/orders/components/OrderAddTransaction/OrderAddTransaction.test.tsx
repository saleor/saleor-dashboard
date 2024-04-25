// @ts-strict-ignore
import { order } from "@dashboard/orders/fixtures";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import OrderAddTransaction from "./OrderAddTransaction";

describe("OrderAddTransaction", () => {
  it("renders skeleton when order is loading", () => {
    render(<OrderAddTransaction order={undefined} onAddTransaction={() => undefined} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
  it("calls onAddTransaction when clicked", async () => {
    const callback = jest.fn();

    render(
      <Wrapper>
        <OrderAddTransaction order={order(null)} onAddTransaction={callback} />
      </Wrapper>,
    );

    const button = await screen.findByRole("button");

    expect(button).toBeInTheDocument();
    await userEvent.click(button);
    expect(callback).toHaveBeenCalled();
  });
});
