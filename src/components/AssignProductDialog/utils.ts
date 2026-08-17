import { type ProductChannels, type SelectedChannel } from "./types";

export const getSelectedIdsFromDict = (selection: Record<string, boolean>): string[] =>
  Object.entries(selection)
    .filter(([, isSelected]) => isSelected)
    .map(([id]) => id)
    .sort((a, b) => a.localeCompare(b));

export const hasMultiSelectionChanged = (
  current: Record<string, boolean>,
  initial: Record<string, boolean>,
): boolean => {
  const currentIds = getSelectedIdsFromDict(current);
  const initialIds = getSelectedIdsFromDict(initial);

  if (currentIds.length !== initialIds.length) {
    return true;
  }

  return currentIds.some((id, index) => id !== initialIds[index]);
};

export const hasSingleSelectionChanged = (current: string, initial: string): boolean =>
  current !== initial;

export const isProductAvailableInVoucherChannels = (
  productChannels?: ProductChannels,
  selectedChannels?: SelectedChannel[],
) => {
  // No voucher channel restriction yet — allow assigning products during setup.
  // (`[]` must match `undefined`; create/details often pass an empty listings array.)
  if (!selectedChannels?.length) {
    return true;
  }

  // If there are no product channels, the product is not available in any channel
  if (!productChannels?.length) {
    return false;
  }

  const selectedChannelsIds = selectedChannels.map(chan => chan.id);
  const productChannelsIds = productChannels.map(chan => chan.channel.id);

  return productChannelsIds.some(productChannel => selectedChannelsIds.includes(productChannel));
};

export const getSelectAllVisibleCheckboxState = (
  selectableVisibleIds: string[],
  productsDict: Record<string, boolean>,
): { checked: boolean; indeterminate: boolean } => {
  if (selectableVisibleIds.length === 0) {
    return { checked: false, indeterminate: false };
  }

  const selectedCount = selectableVisibleIds.filter(id => productsDict[id]).length;

  return {
    checked: selectedCount === selectableVisibleIds.length,
    indeterminate: selectedCount > 0 && selectedCount < selectableVisibleIds.length,
  };
};

export const applySelectAllVisibleToggle = ({
  productsDict,
  selectableVisibleIds,
  maxSelection,
}: {
  productsDict: Record<string, boolean>;
  selectableVisibleIds: string[];
  maxSelection?: number;
}): { nextDict: Record<string, boolean>; skipped: number } => {
  const allVisibleSelected =
    selectableVisibleIds.length > 0 && selectableVisibleIds.every(id => productsDict[id]);

  if (allVisibleSelected) {
    const nextDict = { ...productsDict };

    selectableVisibleIds.forEach(id => {
      nextDict[id] = false;
    });

    return { nextDict, skipped: 0 };
  }

  const currentlySelectedCount = getSelectedIdsFromDict(productsDict).length;
  const nextDict = { ...productsDict };
  let skipped = 0;
  let added = 0;

  selectableVisibleIds.forEach(id => {
    if (productsDict[id]) {
      return;
    }

    if (maxSelection !== undefined && currentlySelectedCount + added >= maxSelection) {
      skipped++;

      return;
    }

    nextDict[id] = true;
    added++;
  });

  return { nextDict, skipped };
};
