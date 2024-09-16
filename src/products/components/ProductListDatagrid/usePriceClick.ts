import { useConditionalFilterContext } from "@dashboard/components/ConditionalFilter";
import { Condition, FilterElement } from "@dashboard/components/ConditionalFilter/FilterElement";
import { ExpressionValue } from "@dashboard/components/ConditionalFilter/FilterElement/FilterElement";

export const usePriceClick = ({ isChannelSelected }: { isChannelSelected: boolean }) => {
  const { filterWindow, containerState } = useConditionalFilterContext();

  return (productId: string) => {
    if (!productId || isChannelSelected) return;

    const channelFilterElement = new FilterElement(
      ExpressionValue.fromSlug("channel"),
      Condition.emptyFromSlug("channel"),
      false,
    );

    channelFilterElement.clearConstraint();

    containerState.create(channelFilterElement);

    window.scrollTo({ top: 0, behavior: "smooth" });

    filterWindow.setOpen(true);
  };
};
