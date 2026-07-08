import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { Select } from "@dashboard/components/Select";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { buttonMessages } from "@dashboard/intl";
import { type Option, Text } from "@saleor/macaw-ui-next";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "../styles";

const messages = defineMessages({
  deleteChannel: {
    id: "LATHyi",
    defaultMessage: "Delete Channel: {channelSlug} ",
    description: "dialog header",
  },
  deletingAllProductData: {
    id: "GCho9N",
    defaultMessage:
      "All channel settings information such as shipping, product listings, warehouse assignments, etc, will be lost.",
    description: "delete channel",
  },
  needToBeMoved: {
    id: "BR8au7",
    defaultMessage: "Select channel that you wish to move existing orders to.",
    description: "delete channel",
  },
  note: {
    id: "wXFttp",
    defaultMessage: "Note: Only channels with matching currency are available.",
    description: "note on currency",
  },
  noAvailableChannel: {
    id: "a24HjK",
    defaultMessage:
      "To delete {channelSlug} you have to create a channel with currency: {currency} to be able to move all existing orders.",
    description: "currency channel",
  },
  selectChannel: {
    id: "GP0zGO",
    defaultMessage: "Select destination channel:",
    description: "dialog header",
  },
});

interface ChannelDeleteDialogProps {
  channelsChoices: Option[];
  channelSlug: string;
  currency: string;
  hasOrders: boolean;
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  onBack: () => void;
  onClose: () => void;
  onConfirm: (targetChannelId: string) => void;
}

export const ChannelDeleteDialog = ({
  channelsChoices = [],
  channelSlug,
  hasOrders,
  confirmButtonState,
  open,
  currency,
  onClose,
  onConfirm,
}: ChannelDeleteDialogProps) => {
  const classes = useStyles({});
  const intl = useIntl();
  const [choice, setChoice] = useStateFromProps(
    channelsChoices.length ? channelsChoices[0].value : "",
  );
  const hasChannels = !!channelsChoices?.length;
  const canBeDeleted = hasChannels || !hasOrders;
  const isSubmitting = confirmButtonState === "loading";

  const handleClose = (): void => {
    if (isSubmitting) {
      return;
    }

    onClose();
  };

  return (
    <DashboardModal onChange={handleClose} open={open}>
      <DashboardModal.Content size="sm">
        <DashboardModal.ContextHeader>
          <FormattedMessage {...messages.deleteChannel} values={{ channelSlug }} />
        </DashboardModal.ContextHeader>

        <DashboardModal.Body fill>
          <DashboardModal.Inset>
            {hasOrders ? (
              hasChannels ? (
                <>
                  <Text>{intl.formatMessage(messages.deletingAllProductData)}</Text>
                  <br />
                  <Text>
                    {intl.formatMessage(messages.needToBeMoved)}
                    <br />
                    {intl.formatMessage(messages.note)}
                  </Text>
                  <div className={classes.select}>
                    <Select
                      label={intl.formatMessage(messages.selectChannel)}
                      name="channels"
                      onChange={({ target }) => setChoice(target.value)}
                      value={choice}
                      options={channelsChoices}
                    />
                  </div>
                </>
              ) : (
                <Text>
                  {intl.formatMessage(messages.noAvailableChannel, {
                    channelSlug: <strong>{channelSlug}</strong>,
                    currency: <strong>{currency}</strong>,
                  })}
                </Text>
              )
            ) : (
              <Text>{intl.formatMessage(messages.deletingAllProductData)}</Text>
            )}
          </DashboardModal.Inset>
        </DashboardModal.Body>

        <DashboardModal.Actions>
          {canBeDeleted ? (
            <>
              <BackButton disabled={isSubmitting} onClick={handleClose} />
              <ConfirmButton
                data-test-id="submit"
                disabled={isSubmitting}
                onClick={() => onConfirm(choice)}
                transitionState={confirmButtonState}
                variant="error"
              >
                <FormattedMessage {...buttonMessages.delete} />
              </ConfirmButton>
            </>
          ) : (
            <BackButton disabled={isSubmitting} onClick={handleClose}>
              <FormattedMessage {...buttonMessages.ok} />
            </BackButton>
          )}
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

ChannelDeleteDialog.displayName = "ChannelDeleteDialog";
