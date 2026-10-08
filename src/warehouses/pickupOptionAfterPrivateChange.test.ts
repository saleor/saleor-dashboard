import { WarehouseClickAndCollectOptionEnum } from "@dashboard/graphql";

import {
  isPrivateForPickupOption,
  pickupFormChange,
  type PickupFormValues,
  pickupOptionWhenEnabled,
} from "./pickupOptionAfterPrivateChange";

describe("isPrivateForPickupOption", () => {
  it("makes the warehouse public when pickup is packed from stock here", () => {
    // Arrange
    const option = WarehouseClickAndCollectOptionEnum.LOCAL;

    // Act
    const isPrivate = isPrivateForPickupOption(option);

    // Assert
    expect(isPrivate).toBe(false);
  });

  it("makes the warehouse private for every other pickup choice", () => {
    // Arrange
    const options = [
      WarehouseClickAndCollectOptionEnum.ALL,
      WarehouseClickAndCollectOptionEnum.DISABLED,
    ];

    // Act
    const flags = options.map(isPrivateForPickupOption);

    // Assert
    expect(flags).toEqual([true, true]);
  });
});

describe("pickupOptionWhenEnabled", () => {
  it("starts from stock at this warehouse when pickup was off", () => {
    // Arrange
    const saved = WarehouseClickAndCollectOptionEnum.DISABLED;

    // Act
    const option = pickupOptionWhenEnabled(saved);

    // Assert
    expect(option).toBe(WarehouseClickAndCollectOptionEnum.LOCAL);
  });

  it("restores the saved choice when pickup was on", () => {
    // Arrange
    const saved = WarehouseClickAndCollectOptionEnum.ALL;

    // Act
    const option = pickupOptionWhenEnabled(saved);

    // Assert
    expect(option).toBe(WarehouseClickAndCollectOptionEnum.ALL);
  });
});

describe("pickupFormChange", () => {
  it("restores the saved privacy when pickup goes back to the saved option", () => {
    // Arrange
    const saved: PickupFormValues = {
      clickAndCollectOption: WarehouseClickAndCollectOptionEnum.DISABLED,
      isPrivate: false,
    };

    // Act
    const values = pickupFormChange({
      option: WarehouseClickAndCollectOptionEnum.DISABLED,
      saved,
    });

    // Assert
    expect(values).toEqual(saved);
  });

  it("derives privacy from a new pickup option", () => {
    // Arrange
    const saved: PickupFormValues = {
      clickAndCollectOption: WarehouseClickAndCollectOptionEnum.LOCAL,
      isPrivate: false,
    };

    // Act
    const values = pickupFormChange({
      option: WarehouseClickAndCollectOptionEnum.DISABLED,
      saved,
    });

    // Assert
    expect(values).toEqual({
      clickAndCollectOption: WarehouseClickAndCollectOptionEnum.DISABLED,
      isPrivate: true,
    });
  });
});
