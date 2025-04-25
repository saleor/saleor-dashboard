import { FilterValueProvider } from "@dashboard/components/ConditionalFilter/FilterValueProvider";

export const getNextUniqueTabName = (name: string, avialabeNames: string[]) => {
  let uniqueName = name;
  let i = 1;

  while (avialabeNames.includes(uniqueName)) {
    uniqueName = `${name} ${i}`;
    i++;
  }

  return uniqueName;
};

export const getActiveTabIndexAfterTabDelete = (
  currentTab: number,
  tabIndexToDelete: number,
): string => (tabIndexToDelete < currentTab ? `${currentTab - 1}` : `${currentTab}`);

export const obtainChannelFromFilter = (valueProvider: FilterValueProvider) => {
  const channelToken = valueProvider.getTokenByName("channel");

  if (channelToken) {
    return channelToken.value;
  }
};
