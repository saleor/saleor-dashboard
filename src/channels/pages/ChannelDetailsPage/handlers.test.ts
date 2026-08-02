import { type FormData } from "@dashboard/channels/components/ChannelForm/ChannelForm";
import { AllocationStrategyEnum } from "@dashboard/graphql";

import {
  createShippingZoneAddHandler,
  createWarehouseAddHandler,
  createWarehouseReorderHandler,
} from "./handlers";

const baseFormData = {
  name: "Channel",
  slug: "channel",
  currencyCode: "USD",
  defaultCountry: "US",
  shippingZonesIdsToAdd: [],
  shippingZonesIdsToRemove: [],
  warehousesIdsToAdd: [],
  warehousesIdsToRemove: [],
  shippingZonesToDisplay: [],
  warehousesToDisplay: [
    { id: "w1", name: "One" },
    { id: "w2", name: "Two" },
  ],
  allocationStrategy: AllocationStrategyEnum.PRIORITIZE_SORTING_ORDER,
} as unknown as FormData;

describe("ChannelDetailsPage handlers", () => {
  it("stages warehouse assigns until Save", () => {
    // Arrange
    const set = jest.fn();
    const addWarehouse = createWarehouseAddHandler(baseFormData, set);

    // Act
    addWarehouse([{ id: "w3", name: "Three" }]);

    // Assert
    expect(set).toHaveBeenCalledWith(
      expect.objectContaining({
        warehousesIdsToAdd: ["w3"],
        warehousesToDisplay: [
          { id: "w1", name: "One" },
          { id: "w2", name: "Two" },
          { id: "w3", name: "Three" },
        ],
      }),
    );
  });

  it("stages shipping zone assigns until Save", () => {
    // Arrange
    const set = jest.fn();
    const addZone = createShippingZoneAddHandler(baseFormData, set);

    // Act
    addZone([{ id: "z1", name: "EU" }]);

    // Assert
    expect(set).toHaveBeenCalledWith(
      expect.objectContaining({
        shippingZonesIdsToAdd: ["z1"],
        shippingZonesToDisplay: [{ id: "z1", name: "EU" }],
      }),
    );
  });

  it("updates warehouse display order on reorder", () => {
    // Arrange
    const set = jest.fn();
    const reorder = createWarehouseReorderHandler(baseFormData, set);

    // Act
    reorder({ oldIndex: 0, newIndex: 1 });

    // Assert
    expect(set).toHaveBeenCalledWith(
      expect.objectContaining({
        warehousesToDisplay: [
          { id: "w2", name: "Two" },
          { id: "w1", name: "One" },
        ],
      }),
    );
  });
});
