import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ReactElement } from "react";

import { WarehouseSetupChecklist } from "./WarehouseSetupChecklist";

const renderChecklist = (canManage: boolean, onAddChannel: () => void = jest.fn()): ReactElement =>
  render(
    <Wrapper>
      <WarehouseSetupChecklist canManage={canManage} onAddChannel={onAddChannel} />
    </Wrapper>,
  );

describe("WarehouseSetupChecklist", () => {
  it("asks to add a channel before stock can be sold", async () => {
    // Arrange
    const onAddChannel = jest.fn();

    renderChecklist(true, onAddChannel);

    // Act
    await userEvent.click(screen.getByTestId("warehouse-setup-add-channel"));

    // Assert
    expect(
      screen.getByText("Stock here can't be sold until this location is added to a channel."),
    ).toBeInTheDocument();
    expect(onAddChannel).toHaveBeenCalledTimes(1);
  });

  it("hides the action when the user cannot manage channels", () => {
    // Arrange
    renderChecklist(false);

    // Assert
    expect(screen.queryByTestId("warehouse-setup-add-channel")).not.toBeInTheDocument();
  });
});
