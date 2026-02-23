import { useContext } from "react";

import {
  type GiftCardDetailsConsumerProps,
  GiftCardDetailsContext,
} from "../GiftCardDetailsProvider";

const useGiftCardDetails = (): GiftCardDetailsConsumerProps => {
  const giftCardDetailsConsumerProps = useContext(GiftCardDetailsContext);

  return giftCardDetailsConsumerProps;
};

export default useGiftCardDetails;
