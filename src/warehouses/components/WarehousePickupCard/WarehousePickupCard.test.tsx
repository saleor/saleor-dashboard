import { WarehouseClickAndCollectOptionEnum } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { fireEvent, render, screen, within } from "@testing-library/react";

import { WarehousePickupCard } from "./WarehousePickupCard";

const renderCard = (
  props: Partial<{
    clickAndCollectOption: WarehouseClickAndCollectOptionEnum;
    onOptionChange: (option: WarehouseClickAndCollectOptionEnum) => void;
  }> = {},
) => {
  const onOptionChange = props.onOptionChange ?? jest.fn();

  render(
    <Wrapper>
      <WarehousePickupCard
        clickAndCollectOption={
          props.clickAndCollectOption ?? WarehouseClickAndCollectOptionEnum.DISABLED
        }
        disabled={false}
        onOptionChange={onOptionChange}
      />
    </Wrapper>,
  );

  return { onOptionChange };
};

describe("WarehousePickupCard", () => {
  it("only says whether customers can collect orders when pickup is off", () => {
    // Arrange
    renderCard();

    // Assert
    expect(screen.getByText("Customers can't collect orders here.")).toBeInTheDocument();
    expect(screen.queryByTestId("warehouse-pickup-advanced")).not.toBeInTheDocument();
  });

  it("keeps where the items come from inside a closed advanced section when pickup is on", () => {
    // Arrange
    renderCard({ clickAndCollectOption: WarehouseClickAndCollectOptionEnum.LOCAL });

    // Assert
    expect(screen.getByTestId("warehouse-pickup-advanced")).toHaveAttribute(
      "data-expanded",
      "false",
    );
    expect(
      screen.getByText(
        "Customers can collect orders at this address. Tax for those orders uses this address.",
      ),
    ).toBeInTheDocument();
  });

  it("selects stock at this location when pickup is switched on", () => {
    // Arrange
    const { onOptionChange } = renderCard();

    // Act
    fireEvent.click(within(screen.getByTestId("warehouse-pickup-toggle")).getByRole("button"));

    // Assert
    expect(onOptionChange).toHaveBeenCalledWith(WarehouseClickAndCollectOptionEnum.LOCAL);
  });
});
