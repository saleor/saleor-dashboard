import { useConditionalFilterContext } from "@dashboard/components/ConditionalFilter";
import { createChannelFilterElement } from "@dashboard/products/components/ProductListDatagrid/utils";

export const usePriceClick = ({ isChannelSelected }: { isChannelSelected: boolean }) => {
  const { filterWindow, containerState } = useConditionalFilterContext();

  return (productId: string): boolean => {
    if (!productId || isChannelSelected) return false;

    containerState.createAndRemoveEmpty(createChannelFilterElement());

    window.scrollTo({ top: 0, behavior: "smooth" });

    filterWindow.setOpen(true);

    return true;
  };
};
