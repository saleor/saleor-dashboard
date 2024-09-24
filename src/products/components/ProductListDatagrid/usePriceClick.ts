import { useConditionalFilterContext } from "@dashboard/components/ConditionalFilter";
import { createChannelFilterElement } from "@dashboard/products/components/ProductListDatagrid/utils";

export const usePriceClick = ({ isChannelSelected }: { isChannelSelected: boolean }) => {
  const { filterWindow, containerState } = useConditionalFilterContext();

  return (productId: string) => {
    if (!productId || isChannelSelected) return;

    containerState.create(createChannelFilterElement());

    window.scrollTo({ top: 0, behavior: "smooth" });

    filterWindow.setOpen(true);
  };
};
