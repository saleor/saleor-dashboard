import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import { type ReactElement } from "react";

import { WarehouseDeleteDialog } from "./WarehouseDeleteDialog";

const renderDialog = ({
  stockCount = null,
  channelCount = null,
}: {
  stockCount?: number | null;
  channelCount?: number | null;
} = {}): ReactElement =>
  render(
    <Wrapper>
      <WarehouseDeleteDialog
        confirmButtonState="default"
        name="Europe"
        open
        stockCount={stockCount}
        channelCount={channelCount}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />
    </Wrapper>,
  );

describe("WarehouseDeleteDialog", () => {
  it("names the stock records and channels that will be deleted", () => {
    // Arrange
    renderDialog({ stockCount: 3, channelCount: 2 });

    // Assert
    expect(screen.getByTestId("warehouse-delete-impact")).toHaveTextContent(
      "Deletes 3 stock records and their allocations. It is removed from 2 channels.",
    );
  });

  it("does not invent counts that were not loaded", () => {
    // Arrange
    renderDialog();

    // Assert
    expect(screen.getByTestId("warehouse-delete-impact")).toHaveTextContent(
      "Deletes its stock records and their allocations. It is removed from every channel it is in.",
    );
  });

  it("says when there is no stock and the location is in one channel", () => {
    // Arrange
    renderDialog({ stockCount: 0, channelCount: 1 });

    // Assert
    expect(screen.getByTestId("warehouse-delete-impact")).toHaveTextContent(
      "There is no stock at this location. It is removed from 1 channel.",
    );
  });
});
