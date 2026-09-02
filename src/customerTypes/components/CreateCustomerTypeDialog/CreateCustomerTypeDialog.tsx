import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton/ConfirmButton";
import Form from "@dashboard/components/Form/Form";
import { DashboardModal } from "@dashboard/components/Modal";
import { type CustomerTypeCreateErrorFragment } from "@dashboard/graphql";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import { buttonMessages, commonMessages } from "@dashboard/intl";
import { Box, Input, Text } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";

export interface CreateCustomerTypeFormData {
  name: string;
}

interface CreateCustomerTypeDialogProps {
  open: boolean;
  confirmButtonState: ConfirmButtonTransitionState;
  disabled?: boolean;
  errors: CustomerTypeCreateErrorFragment[];
  onClose: () => void;
  onSubmit: (data: CreateCustomerTypeFormData) => SubmitPromise<CustomerTypeCreateErrorFragment[]>;
}

interface CreateCustomerTypeFields {
  name: string;
}

export const CreateCustomerTypeDialog = ({
  open,
  confirmButtonState,
  disabled = false,
  errors: apiErrors,
  onClose,
  onSubmit,
}: CreateCustomerTypeDialogProps): JSX.Element => {
  const intl = useIntl();
  const [submitErrors, setSubmitErrors] = useState<CustomerTypeCreateErrorFragment[]>([]);
  const [showApiErrors, setShowApiErrors] = useState(false);
  const [prevOpen, setPrevOpen] = useState<boolean | null>(null);
  const initialForm: CreateCustomerTypeFields = {
    name: "",
  };

  if (prevOpen !== open) {
    setPrevOpen(open);
    setSubmitErrors([]);
    setShowApiErrors(false);
  }

  const fieldErrors = [...(showApiErrors ? apiErrors : []), ...submitErrors]
    .map(error => error.message)
    .filter(Boolean)
    .join(" ");

  return (
    <DashboardModal onChange={onClose} open={open}>
      {open ? (
        <Form
          initial={initialForm}
          onSubmit={async data => {
            setShowApiErrors(true);

            const errors = await onSubmit({
              name: data.name.trim(),
            });

            setSubmitErrors(errors ?? []);

            return errors;
          }}
          disabled={disabled}
        >
          {({ change, data, submit }) => (
            <DashboardModal.Content size="sm" data-test-id="create-customer-type-dialog">
              <DashboardModal.ContextHeader
                description={<FormattedMessage {...messages.description} />}
              >
                <FormattedMessage {...messages.title} />
              </DashboardModal.ContextHeader>

              <DashboardModal.Body>
                <DashboardModal.Inset>
                  <Box display="flex" flexDirection="column" gap={4}>
                    <Input
                      name="name"
                      label={intl.formatMessage(commonMessages.name)}
                      value={data.name}
                      onChange={change}
                      disabled={disabled}
                      helperText={intl.formatMessage(messages.nameHelper)}
                      data-test-id="customer-type-name-input"
                      autoFocus
                    />
                    {fieldErrors ? (
                      <Text size={2} color="critical1" as="p">
                        {fieldErrors}
                      </Text>
                    ) : null}
                  </Box>
                </DashboardModal.Inset>
              </DashboardModal.Body>

              <DashboardModal.Actions>
                <BackButton onClick={onClose} />
                <ConfirmButton
                  transitionState={confirmButtonState}
                  onClick={submit}
                  disabled={disabled || !data.name.trim()}
                  data-test-id="submit"
                >
                  <FormattedMessage {...buttonMessages.create} />
                </ConfirmButton>
              </DashboardModal.Actions>
            </DashboardModal.Content>
          )}
        </Form>
      ) : null}
    </DashboardModal>
  );
};
