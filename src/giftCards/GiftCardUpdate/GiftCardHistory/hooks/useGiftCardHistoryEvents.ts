import { useUser } from "@dashboard/auth";
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

  const canSeeApp =
    user?.userPermissions?.some(permission => APP_PERMISSIONS.includes(permission.code)) || false;
  const canSeeUser =
    user?.userPermissions?.some(permission => USER_PERMISSIONS.includes(permission.code)) || false;

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
