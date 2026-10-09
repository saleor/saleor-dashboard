import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { WarehouseDetailsPageLoading } from "./WarehouseDetailsPageLoading";

jest.mock("@dashboard/components/Savebar");

const renderShell = (onRetry?: () => void): ReturnType<typeof render> => {
  const channelsCard: ReactNode = <div data-test-id="channels-card" />;

  return render(
    <MemoryRouter>
      <WarehouseDetailsPageLoading channelsCard={channelsCard} onRetry={onRetry} />
    </MemoryRouter>,
    { wrapper: Wrapper },
  );
};

describe("WarehouseDetailsPageLoading", () => {
  it("shows skeleton cards while the warehouse loads", () => {
    // Arrange
    const onRetry = undefined;

    // Act
    renderShell(onRetry);

    // Assert
    expect(screen.getByTestId("warehouse-details-loading")).toHaveAttribute("aria-busy", "true");
    expect(screen.queryByTestId("warehouse-details-load-error")).not.toBeInTheDocument();
  });

  it("shows the error and retries when the warehouse failed to load", async () => {
    // Arrange
    const onRetry = jest.fn();

    renderShell(onRetry);

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Retry" }));

    // Assert
    expect(screen.getByText("Couldn't load this warehouse.")).toBeInTheDocument();
    expect(screen.queryByTestId("warehouse-details-loading")).not.toBeInTheDocument();
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
