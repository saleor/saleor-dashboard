import { WarehouseClickAndCollectOptionEnum } from "@dashboard/graphql";

/** Saleor only allows pickup from stock at this location on a public warehouse. */
export const isPrivateForPickupOption = (option: WarehouseClickAndCollectOptionEnum): boolean =>
  option !== WarehouseClickAndCollectOptionEnum.LOCAL;

/** The usual pickup: customers collect an order packed from stock at this location. */
export const pickupOptionWhenEnabled = (): WarehouseClickAndCollectOptionEnum =>
  WarehouseClickAndCollectOptionEnum.LOCAL;
