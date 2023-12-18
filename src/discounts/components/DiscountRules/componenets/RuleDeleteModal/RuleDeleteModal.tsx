import {
  ConfirmButton,
  ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "../../messages";

interface RuleDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  confimButtonState: ConfirmButtonTransitionState;
}

export const RuleDeleteModal = ({
  open,
  onClose,
  onSubmit,
  confimButtonState,
}: RuleDeleteModalProps) => {
  const intl = useIntl();

  return (
    <DashboardModal open={open} onChange={onClose}>
      <DashboardModal.Content>
        <DashboardModal.Title
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          {intl.formatMessage(messages.deleteRule)}
          <DashboardModal.Close onClose={onClose} />
        </DashboardModal.Title>

        <Box __width={390}>
          <Text>
            <FormattedMessage {...messages.deleteRuleDescription} />
          </Text>
        </Box>

        <DashboardModal.Actions>
          <Button onClick={onClose} variant="secondary">
            <FormattedMessage {...buttonMessages.close} />
          </Button>
          <ConfirmButton transitionState={confimButtonState} onClick={onSubmit}>
            <FormattedMessage {...buttonMessages.delete} />
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
