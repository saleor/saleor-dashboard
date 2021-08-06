import { useContext } from "react";

import { GiftCardDetailsConsumerProps } from "../providers/GiftCardDetailsProvider";
import { GiftCardDetailsContext } from "../providers/GiftCardDetailsProvider";

const useGiftCardDetails = (): GiftCardDetailsConsumerProps => {
  const giftCardDetailsConsumerProps = useContext(GiftCardDetailsContext);

  return giftCardDetailsConsumerProps;
};

export default useGiftCardDetails;
