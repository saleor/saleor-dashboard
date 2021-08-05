import { UseListSettings } from "@saleor/hooks/useListSettings";
import { useContext } from "react";

import {
  GiftCardListDataProps,
  GiftCardsListContext
} from "../providers/GiftCardsListProvider";
import { GiftCardListColummns } from "../types";

type UseGiftCardListProps = GiftCardListDataProps &
  UseListSettings<GiftCardListColummns>;

const useGiftCardList = (): UseGiftCardListProps => {
  const {
    giftCards,
    loading,
    pageInfo,
    paginationState,
    params,
    settings,
    updateListSettings,
    numberOfColumns
  } = useContext(GiftCardsListContext);

  return {
    giftCards,
    loading,
    pageInfo,
    paginationState,
    params,
    settings,
    updateListSettings,
    numberOfColumns
  };
};

export default useGiftCardList;
