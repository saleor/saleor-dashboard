import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { Button, Text } from "@saleor/macaw-ui-next";
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
      <DashboardModal.Content size="xs" data-test-id="delete-rule-dialog">
        <DashboardModal.Header onClose={onClose}>
          {intl.formatMessage(messages.deleteRule)}
        </DashboardModal.Header>

        <Text>
          <FormattedMessage {...messages.deleteRuleDescription} />
        </Text>

        <DashboardModal.Actions>
          <Button onClick={onClose} variant="secondary" data-test-id="cancel-delete-rule-button">
            <FormattedMessage {...buttonMessages.close} />
          </Button>
          <ConfirmButton
            transitionState={confimButtonState}
            onClick={onSubmit}
            data-test-id="delete-rule-button"
          >
            <FormattedMessage {...buttonMessages.delete} />
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
