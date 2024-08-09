import { useGiftCardPermissions } from "@dashboard/giftCards/hooks/useGiftCardPermissions";
import { GiftCardEventsQuery, useGiftCardEventsQuery } from "@dashboard/graphql";
import { useContext } from "react";

import { GiftCardDetailsContext } from "../../providers/GiftCardDetailsProvider";

interface GiftCardHistoryEvents {
  id: string | undefined;
  events: NonNullable<GiftCardEventsQuery["giftCard"]>["events"] | null | undefined;
}

const useGiftCardHistoryEvents = (): GiftCardHistoryEvents => {
  const { canSeeApp, canSeeUser } = useGiftCardPermissions();

  const { giftCard } = useContext(GiftCardDetailsContext);
  const { data } = useGiftCardEventsQuery({
    variables: giftCard
      ? {
          canSeeApp,
          canSeeUser,
          id: giftCard.id,
        }
      : undefined,
    skip: !giftCard?.id,
  });

  return {
    id: giftCard?.id,
    events: data?.giftCard?.events,
  };
};

export default useGiftCardHistoryEvents;
