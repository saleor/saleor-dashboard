import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DashboardModal } from "@dashboard/components/Modal";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { buttonMessages } from "@dashboard/intl";
import { Box, RadioGroup, Text } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

import { CustomerChangeActionEnum, type OrderCustomerChangeData } from "./form";
import { orderCustomerChangeDialogMessages as messages } from "./messages";

interface OrderCustomerChangeDialogProps {
  open: boolean;
  onConfirm: (data: OrderCustomerChangeData) => void;
  onClose: () => void;
}

const INITIAL_FORM_DATA: OrderCustomerChangeData = {
  changeActionOption: CustomerChangeActionEnum.KEEP_ADDRESS,
};

export const OrderCustomerChangeDialog = ({
  open,
  onClose,
  onConfirm,
}: OrderCustomerChangeDialogProps) => {
  const [formKey, setFormKey] = useState(0);

  useModalDialogOpen(open, {
    onOpen: () => setFormKey(current => current + 1),
  });

  return (
    <DashboardModal onChange={onClose} open={open}>
      <Form key={formKey} initial={INITIAL_FORM_DATA} onSubmit={onConfirm}>
        {({ change, data, submit }) => (
          <DashboardModal.Content size="sm" data-test-id="customer-change-dialog">
            <DashboardModal.Header subtitle={<FormattedMessage {...messages.description} />}>
              <FormattedMessage {...messages.title} />
            </DashboardModal.Header>

            <DashboardModal.Body>
              <DashboardModal.Inset>
                <RadioGroup
                  value={data.changeActionOption}
                  onValueChange={value =>
                    change({
                      target: {
                        name: "changeActionOption",
                        value,
                      },
                    })
                  }
                >
                  <Box display="flex" flexDirection="column" gap={3}>
                    <RadioGroup.Item
                      id="keep-address"
                      value={CustomerChangeActionEnum.KEEP_ADDRESS}
                      data-test-id="keep-address-option"
                    >
                      <Text>
                        <FormattedMessage {...messages.keepAddress} />
                      </Text>
                    </RadioGroup.Item>
                    <RadioGroup.Item
                      id="change-address"
                      value={CustomerChangeActionEnum.CHANGE_ADDRESS}
                      data-test-id="change-address-option"
                    >
                      <Text>
                        <FormattedMessage {...messages.changeAddress} />
                      </Text>
                    </RadioGroup.Item>
                  </Box>
                </RadioGroup>
              </DashboardModal.Inset>
            </DashboardModal.Body>

            <DashboardModal.Actions>
              <BackButton onClick={onClose} />
              <ConfirmButton data-test-id="submit" transitionState="default" onClick={submit}>
                <FormattedMessage {...buttonMessages.continue} />
              </ConfirmButton>
            </DashboardModal.Actions>
          </DashboardModal.Content>
        )}
      </Form>
    </DashboardModal>
  );
};

OrderCustomerChangeDialog.displayName = "OrderCustomerChangeDialog";
