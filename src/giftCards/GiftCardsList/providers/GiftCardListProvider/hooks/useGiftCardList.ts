import { UseListSettings } from "@saleor/hooks/useListSettings";
import { useContext } from "react";

import { GiftCardListColummns } from "../../../types";
import {
  GiftCardListDataProps,
  GiftCardsListContext
} from "../GiftCardListProvider";

export type UseGiftCardListProps = GiftCardListDataProps &
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
