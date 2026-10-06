import { WarehouseClickAndCollectOptionEnum } from "@dashboard/graphql";

import {
  isPrivateForPickupOption,
  pickupOptionWhenEnabled,
} from "./pickupOptionAfterPrivateChange";

describe("isPrivateForPickupOption", () => {
  it("makes the location public when pickup is packed from stock here", () => {
    // Arrange
    const option = WarehouseClickAndCollectOptionEnum.LOCAL;

    // Act
    const isPrivate = isPrivateForPickupOption(option);

    // Assert
    expect(isPrivate).toBe(false);
  });

  it("makes the location private for every other pickup choice", () => {
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
  it("starts from stock at this location", () => {
    // Act
    const option = pickupOptionWhenEnabled();

    // Assert
    expect(option).toBe(WarehouseClickAndCollectOptionEnum.LOCAL);
  });
});
