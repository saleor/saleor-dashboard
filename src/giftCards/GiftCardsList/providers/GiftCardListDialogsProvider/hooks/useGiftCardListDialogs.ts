import { useContext } from "react";

import {
  GiftCardListDialogsConsumerProps,
  GiftCardListDialogsContext
} from "../GiftCardListDialogsProvider";

const useGiftCardListDialogs = (): GiftCardListDialogsConsumerProps => {
  const giftCardListDialogsProps = useContext(GiftCardListDialogsContext);

  return giftCardListDialogsProps;
};

export default useGiftCardListDialogs;
