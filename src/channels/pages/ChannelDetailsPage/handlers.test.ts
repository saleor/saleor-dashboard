import { type FormData } from "@dashboard/channels/components/ChannelForm/ChannelForm";
import { AllocationStrategyEnum } from "@dashboard/graphql";

import {
  createShippingZoneAddHandler,
  createShippingZoneRemoveHandler,
  createWarehouseAddHandler,
  createWarehouseRemoveHandler,
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

  it("does not stage a removal for a warehouse added in the same edit", () => {
    // Arrange
    const set = jest.fn();
    const removeWarehouse = createWarehouseRemoveHandler(
      {
        ...baseFormData,
        warehousesIdsToAdd: ["w3"],
        warehousesToDisplay: [
          ...baseFormData.warehousesToDisplay,
          { __typename: "Warehouse" as const, id: "w3", name: "Three" },
        ],
      },
      set,
    );

    // Act
    removeWarehouse("w3");

    // Assert
    expect(set).toHaveBeenCalledWith(
      expect.objectContaining({
        warehousesIdsToAdd: [],
        warehousesIdsToRemove: [],
      }),
    );
  });

  it("restores an existing warehouse without staging an add after remove and re-add", () => {
    // Arrange
    const set = jest.fn();
    const addWarehouse = createWarehouseAddHandler(
      {
        ...baseFormData,
        warehousesIdsToRemove: ["w3"],
      },
      set,
    );

    // Act
    addWarehouse([{ id: "w3", name: "Three" }]);

    // Assert
    expect(set).toHaveBeenCalledWith(
      expect.objectContaining({
        warehousesIdsToAdd: [],
        warehousesIdsToRemove: [],
      }),
    );
  });

  it("does not stage a removal for a shipping zone added in the same edit", () => {
    // Arrange
    const set = jest.fn();
    const removeZone = createShippingZoneRemoveHandler(
      {
        ...baseFormData,
        shippingZonesIdsToAdd: ["z1"],
        shippingZonesToDisplay: [{ __typename: "ShippingZone" as const, id: "z1", name: "EU" }],
      },
      set,
    );

    // Act
    removeZone("z1");

    // Assert
    expect(set).toHaveBeenCalledWith(
      expect.objectContaining({
        shippingZonesIdsToAdd: [],
        shippingZonesIdsToRemove: [],
      }),
    );
  });
});
