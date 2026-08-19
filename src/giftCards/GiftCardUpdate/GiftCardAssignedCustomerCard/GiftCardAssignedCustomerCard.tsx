import { type INotification } from "@dashboard/components/notifications";
import { useGiftCardUnassignUserMutation } from "@dashboard/graphql";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import commonErrorMessages from "@dashboard/utils/errors/common";
import { useIntl } from "react-intl";

import useGiftCardDetails from "../providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import useGiftCardUpdateDialogs from "../providers/GiftCardUpdateDialogsProvider/hooks/useGiftCardUpdateDialogs";
import { GIFT_CARD_DETAILS_QUERY } from "../queries";
import { GiftCardAssignedCustomerCardView } from "./GiftCardAssignedCustomerCardView";
import { giftCardAssignedCustomerCardMessages as messages } from "./messages";

export const GiftCardAssignedCustomerCard = (): JSX.Element => {
  const intl = useIntl();
  const notify = useNotifier();
  const { giftCard, loading } = useGiftCardDetails();
  const { openAssignCustomerDialog } = useGiftCardUpdateDialogs();
  const [unassignUser, unassignUserOpts] = useGiftCardUnassignUserMutation({
    onCompleted: data => {
      const errors = data?.giftCardUnassignUser?.errors;
      const notifierData: INotification = errors?.length
        ? {
            status: "error",
            text: intl.formatMessage(commonErrorMessages.unknownError),
          }
        : {
            status: "success",
            text: intl.formatMessage(messages.unassignSuccess),
          };

      notify(notifierData);
    },
    refetchQueries: [GIFT_CARD_DETAILS_QUERY],
  });

  const handleRemove = () => {
    if (!giftCard) {
      return;
    }

    unassignUser({ variables: { id: giftCard.id } });
  };

  return (
    <GiftCardAssignedCustomerCardView
      giftCard={giftCard}
      loading={loading}
      removing={unassignUserOpts.loading}
      onAssign={openAssignCustomerDialog}
      onRemove={handleRemove}
    />
  );
};
