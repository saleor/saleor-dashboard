import { FilterElement } from "@dashboard/components/ConditionalFilter/FilterElement";

export const createChannelFilterElement = () => {
  const channelFilterElement = FilterElement.createStaticBySlug("channel");

  channelFilterElement.clearConstraint();

  return channelFilterElement;
};
