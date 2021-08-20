import { UseBulkActionsProps } from "@saleor/hooks/useBulkActions";
import { useContext } from "react";

import {
  GiftCardsListConsumerProps,
  GiftCardsListContext
} from "../GiftCardListProvider";

export type UseGiftCardListBulkActionsProps = UseBulkActionsProps &
  Pick<GiftCardsListConsumerProps, "selectedItemsCount">;

const useGiftCardListBulkActions = (): UseGiftCardListBulkActionsProps => {
  const {
    isSelected,
    listElements,
    reset,
    toggleAll,
    toggle,
    selectedItemsCount
  } = useContext(GiftCardsListContext);

  return {
    isSelected,
    listElements,
    reset,
    toggleAll,
    toggle,
    selectedItemsCount
  };
};

export default useGiftCardListBulkActions;
