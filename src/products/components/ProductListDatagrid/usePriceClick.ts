import { useConditionalFilterContext } from "@dashboard/components/ConditionalFilter";
import { FilterElement } from "@dashboard/components/ConditionalFilter/FilterElement";

export const usePriceClick = ({ isChannelSelected }: { isChannelSelected: boolean }) => {
  const { filterWindow, containerState } = useConditionalFilterContext();

  return (productId: string) => {
    if (!productId || isChannelSelected) return;

    const channelFilterElement = FilterElement.createStaticBySlug("channel");

    channelFilterElement.clearConstraint();

    containerState.create(channelFilterElement);

    window.scrollTo({ top: 0, behavior: "smooth" });

    filterWindow.setOpen(true);
  };
};
