import { useContext } from "react";

import { GiftCardDetailsContext } from "../../providers/GiftCardDetailsProvider";

const useGiftCardHistoryEvents = () => {
  const { giftCard } = useContext(GiftCardDetailsContext);

  return {
    id: giftCard?.id,
    events: giftCard?.events,
  };
};

export default useGiftCardHistoryEvents;
