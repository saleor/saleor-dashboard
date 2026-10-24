import { WarehouseClickAndCollectOptionEnum } from "@dashboard/graphql";

export interface PickupFormValues {
  clickAndCollectOption: WarehouseClickAndCollectOptionEnum;
  isPrivate: boolean;
}

/** Saleor only allows pickup from stock at this location on a public warehouse. */
export const isPrivateForPickupOption = (option: WarehouseClickAndCollectOptionEnum): boolean =>
  option !== WarehouseClickAndCollectOptionEnum.LOCAL;

/**
 * Turning pickup back on restores the saved choice. The usual pickup, used when the
 * warehouse had none, is from stock at this location.
 */
export const pickupOptionWhenEnabled = (
  saved: WarehouseClickAndCollectOptionEnum,
): WarehouseClickAndCollectOptionEnum =>
  saved === WarehouseClickAndCollectOptionEnum.DISABLED
    ? WarehouseClickAndCollectOptionEnum.LOCAL
    : saved;

/**
 * Form values after a pickup change. Going back to the saved option restores the saved
 * privacy, so a change that cancels itself out leaves nothing to save.
 */
export const pickupFormChange = ({
  option,
  saved,
}: {
  option: WarehouseClickAndCollectOptionEnum;
  saved: PickupFormValues;
}): PickupFormValues => ({
  clickAndCollectOption: option,
  isPrivate:
    option === saved.clickAndCollectOption ? saved.isPrivate : isPrivateForPickupOption(option),
});
