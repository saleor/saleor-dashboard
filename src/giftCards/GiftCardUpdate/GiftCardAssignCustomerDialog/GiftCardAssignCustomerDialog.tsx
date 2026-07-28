import ActionDialog from "@dashboard/components/ActionDialog";
import { type INotification } from "@dashboard/components/notifications";
import { useGiftCardAssignUserMutation } from "@dashboard/graphql";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { getFullName } from "@dashboard/misc";
import { type DialogProps } from "@dashboard/types";
import commonErrorMessages from "@dashboard/utils/errors/common";
import { Box } from "@saleor/macaw-ui-next";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import {
  type AssignedCustomer,
  GiftCardAssignCustomerSelect,
} from "../../components/GiftCardAssignCustomerSelect/GiftCardAssignCustomerSelect";
import useGiftCardDetails from "../providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import { GIFT_CARD_DETAILS_QUERY } from "../queries";
import { giftCardAssignCustomerDialogMessages as messages } from "./messages";

export const GiftCardAssignCustomerDialog = ({ open, onClose }: DialogProps) => {
  const intl = useIntl();
  const notify = useNotifier();
  const { giftCard } = useGiftCardDetails();
  const [selectedCustomer, setSelectedCustomer] = useState<AssignedCustomer | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setSelectedCustomer(
      giftCard?.assignedTo
        ? {
            id: giftCard.assignedTo.id,
            email: giftCard.assignedToEmail ?? "",
            name: getFullName(giftCard.assignedTo) || giftCard.assignedToEmail || "",
          }
        : null,
    );
  }, [open, giftCard?.assignedTo, giftCard?.assignedToEmail]);

  const [assignUser, assignUserOpts] = useGiftCardAssignUserMutation({
    onCompleted: data => {
      const errors = data?.giftCardAssignUser?.errors;
      const notifierData: INotification = errors?.length
        ? {
            status: "error",
            text: intl.formatMessage(commonErrorMessages.unknownError),
          }
        : {
            status: "success",
            text: intl.formatMessage(messages.assignSuccess),
          };

      notify(notifierData);

      if (!errors?.length) {
        onClose();
      }
    },
    refetchQueries: [GIFT_CARD_DETAILS_QUERY],
  });

  const handleConfirm = () => {
    if (!selectedCustomer || !giftCard) {
      return;
    }

    assignUser({
      variables: {
        id: giftCard.id,
        userId: selectedCustomer.id,
      },
    });
  };

  return (
    <ActionDialog
      open={open}
      onConfirm={handleConfirm}
      confirmButtonLabel={intl.formatMessage(messages.assignButtonLabel)}
      onClose={onClose}
      title={intl.formatMessage(messages.title)}
      subtitle={intl.formatMessage(messages.subtitle)}
      confirmButtonState={assignUserOpts.status}
      disabled={assignUserOpts.loading || !selectedCustomer}
    >
      <Box display="grid" gap={2} paddingTop={2}>
        <GiftCardAssignCustomerSelect
          selectedCustomer={selectedCustomer}
          onChange={setSelectedCustomer}
        />
      </Box>
    </ActionDialog>
  );
};
