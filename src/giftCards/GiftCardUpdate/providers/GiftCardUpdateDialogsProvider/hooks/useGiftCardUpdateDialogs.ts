import { useContext } from "react";

import {
  type GiftCardUpdateDialogsConsumerProps,
  GiftCardUpdateDialogsContext,
} from "../GiftCardUpdateDialogsProvider";

const useGiftCardUpdateDialogs = (): GiftCardUpdateDialogsConsumerProps => {
  const giftCardUpdateDialogsProps = useContext(GiftCardUpdateDialogsContext);

  if (!giftCardUpdateDialogsProps) {
    throw new Error("useGiftCardUpdateDialogs must be used within a GiftCardUpdateDialogsProvider");
  }

  return giftCardUpdateDialogsProps;
};

export default useGiftCardUpdateDialogs;
