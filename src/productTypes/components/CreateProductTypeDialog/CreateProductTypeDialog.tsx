import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DashboardModal } from "@dashboard/components/Modal";
import { NewRadioGroupField as RadioGroupField } from "@dashboard/components/RadioGroupField";
import { type ProductErrorFragment, ProductTypeKindEnum } from "@dashboard/graphql";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import { buttonMessages, commonMessages } from "@dashboard/intl";
import { Box, Input, Text } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";

export interface CreateProductTypeFormData {
  name: string;
  kind: ProductTypeKindEnum;
}

interface CreateProductTypeDialogProps {
  open: boolean;
  confirmButtonState: ConfirmButtonTransitionState;
  disabled?: boolean;
  errors: ProductErrorFragment[];
  onClose: () => void;
  onSubmit: (data: CreateProductTypeFormData) => SubmitPromise<ProductErrorFragment[]>;
}

interface CreateProductTypeFields {
  name: string;
  kind: ProductTypeKindEnum;
}

export const CreateProductTypeDialog = ({
  open,
  confirmButtonState,
  disabled = false,
  errors: apiErrors,
  onClose,
  onSubmit,
}: CreateProductTypeDialogProps): JSX.Element => {
  const intl = useIntl();
  const [submitErrors, setSubmitErrors] = useState<ProductErrorFragment[]>([]);
  const [showApiErrors, setShowApiErrors] = useState(false);
  const [prevOpen, setPrevOpen] = useState<boolean | null>(null);
  const initialForm: CreateProductTypeFields = {
    name: "",
    kind: ProductTypeKindEnum.NORMAL,
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

  const kindChoices = [
    {
      value: ProductTypeKindEnum.NORMAL,
      label: (
        <>
          <FormattedMessage {...messages.optionNormalTitle} />
          <Text color="default2" size={2} fontWeight="light" display="block">
            <FormattedMessage {...messages.optionNormalDescription} />
          </Text>
        </>
      ),
    },
    {
      value: ProductTypeKindEnum.GIFT_CARD,
      label: (
        <>
          <FormattedMessage {...messages.optionGiftCardTitle} />
          <Text color="default2" size={2} fontWeight="light" display="block">
            <FormattedMessage {...messages.optionGiftCardDescription} />
          </Text>
        </>
      ),
    },
  ];

  return (
    <DashboardModal onChange={onClose} open={open}>
      {open ? (
        <Form
          initial={initialForm}
          onSubmit={async data => {
            setShowApiErrors(true);

            const errors = await onSubmit({
              name: data.name.trim(),
              kind: data.kind,
            });

            setSubmitErrors(errors ?? []);

            return errors;
          }}
          disabled={disabled}
        >
          {({ change, data, submit }) => (
            <DashboardModal.Content size="sm" data-test-id="create-product-type-dialog">
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
                      data-test-id="product-type-name-input"
                      autoFocus
                    />
                    <Box>
                      <Text size={3} fontWeight="medium" as="p" marginBottom={2}>
                        <FormattedMessage {...messages.kindLabel} />
                      </Text>
                      <RadioGroupField
                        disabled={disabled}
                        choices={kindChoices}
                        name="kind"
                        onChange={change}
                        value={data.kind}
                      />
                    </Box>
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
