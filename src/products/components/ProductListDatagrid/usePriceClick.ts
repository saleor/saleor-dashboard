import { useConditionalFilterContext } from "@dashboard/components/ConditionalFilter";
import { useHistory } from "react-router";

import { getPriceClickSearchParams } from "./utils";

export const usePriceClick = ({ isChannelSelected }: { isChannelSelected: boolean }) => {
  const history = useHistory();
  const { filterWindow } = useConditionalFilterContext();

  const handlePriceClick = (productId: string) => {
    if (!productId || isChannelSelected) return;

    history.replace({ search: getPriceClickSearchParams(history.location.search) });

    window.scrollTo({ top: 0, behavior: "smooth" });

    filterWindow.setOpen(true);
  };

  return handlePriceClick;
};
