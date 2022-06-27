import { useContext } from "react";

import {
  GiftCardUpdateDialogsConsumerProps,
  GiftCardUpdateDialogsContext,
} from "../GiftCardUpdateDialogsProvider";

const useGiftCardUpdateDialogs = (): GiftCardUpdateDialogsConsumerProps => {
  const giftCardUpdateDialogsProps = useContext(GiftCardUpdateDialogsContext);

  return giftCardUpdateDialogsProps;
};

export default useGiftCardUpdateDialogs;
