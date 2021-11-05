import { useContext } from "react";

import {
  GiftCardsListConsumerProps,
  GiftCardsListContext
} from "../../GiftCardListProvider";

type GiftCardSortListProps = Pick<
  GiftCardsListConsumerProps,
  "onSort" | "sort"
>;

const useGiftCardListSort = (): GiftCardSortListProps => {
  const { onSort, sort } = useContext(GiftCardsListContext);

  return { onSort, sort };
};

export default useGiftCardListSort;
