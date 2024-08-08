import { useUser } from "@dashboard/auth";
import { hasOneOfPermissions } from "@dashboard/components/RequirePermissions";
import { GiftCardEventsQuery, PermissionEnum, useGiftCardEventsQuery } from "@dashboard/graphql";
import { useContext } from "react";

import { GiftCardDetailsContext } from "../../providers/GiftCardDetailsProvider";

const APP_PERMISSIONS = [PermissionEnum.MANAGE_APPS];
const USER_PERMISSIONS = [PermissionEnum.MANAGE_USERS, PermissionEnum.MANAGE_STAFF];

interface GiftCardHistoryEvents {
  id: string | undefined;
  events: NonNullable<GiftCardEventsQuery["giftCard"]>["events"] | null | undefined;
}

const useGiftCardHistoryEvents = (): GiftCardHistoryEvents => {
  const { user } = useUser();

  const canSeeApp = hasOneOfPermissions(user?.userPermissions ?? [], APP_PERMISSIONS);
  const canSeeUser = hasOneOfPermissions(user?.userPermissions ?? [], USER_PERMISSIONS);

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
