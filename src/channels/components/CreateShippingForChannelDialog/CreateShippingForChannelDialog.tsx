import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DashboardModal } from "@dashboard/components/Modal";
import { type CountryCode, type ShippingErrorFragment } from "@dashboard/graphql";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { Box, Input, Text } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";

export interface CreateShippingForChannelFormData {
  zoneName: string;
  rateName: string;
  price: string;
}

interface CreateShippingForChannelDialogProps {
  channelName: string;
  currencyCode: string;
  defaultCountryCode: CountryCode | string;
  defaultCountryName: string;
  confirmButtonState: ConfirmButtonTransitionState;
  disabled?: boolean;
  errors: ShippingErrorFragment[];
  open: boolean;
  warehouseName?: string;
  onClose: () => void;
  onSubmit: (data: CreateShippingForChannelFormData) => SubmitPromise<ShippingErrorFragment[]>;
}

export const CreateShippingForChannelDialog = ({
  channelName,
  currencyCode,
  defaultCountryCode,
  defaultCountryName,
  confirmButtonState,
  disabled = false,
  errors: apiErrors,
  open,
  warehouseName,
  onClose,
  onSubmit,
}: CreateShippingForChannelDialogProps) => {
  const intl = useIntl();
  const [submitErrors, setSubmitErrors] = useState<ShippingErrorFragment[]>([]);
  const [formKey, setFormKey] = useState(0);
  const suggestedZoneName = defaultCountryName || intl.formatMessage(messages.domestic);

  const initialForm: CreateShippingForChannelFormData = {
    zoneName: suggestedZoneName,
    rateName: intl.formatMessage(messages.standardShipping),
    price: "0",
  };

  useModalDialogOpen(open, {
    onClose: () => setSubmitErrors([]),
    onOpen: () => {
      setSubmitErrors([]);
      setFormKey(current => current + 1);
    },
  });

  const fieldErrors = [...apiErrors, ...submitErrors]
    .map(error => error.message)
    .filter(Boolean)
    .join(" ");

  return (
    <DashboardModal onChange={onClose} open={open}>
      {open ? (
        <Form
          key={formKey}
          initial={initialForm}
          onSubmit={async data => {
            const errors = await onSubmit(data);

            setSubmitErrors(errors ?? []);

            return errors;
          }}
          disabled={disabled}
        >
          {({ change, data, submit }) => (
            <DashboardModal.Content size="sm" data-test-id="create-shipping-for-channel-dialog">
              <DashboardModal.ContextHeader
                contextLabel={channelName}
                description={
                  <FormattedMessage
                    {...messages.description}
                    values={{
                      country: defaultCountryName || defaultCountryCode,
                      warehouseSuffix: warehouseName
                        ? intl.formatMessage(messages.warehouseSuffix, {
                            warehouse: warehouseName,
                          })
                        : "",
                    }}
                  />
                }
              >
                <FormattedMessage {...messages.title} />
              </DashboardModal.ContextHeader>

              <DashboardModal.Body>
                <DashboardModal.Inset>
                  <Box display="flex" flexDirection="column" gap={4}>
                    <Input
                      name="zoneName"
                      label={intl.formatMessage(messages.zoneName)}
                      value={data.zoneName}
                      onChange={change}
                      disabled={disabled}
                      data-test-id="shipping-zone-name-input"
                    />
                    <Input
                      name="rateName"
                      label={intl.formatMessage(messages.rateName)}
                      value={data.rateName}
                      onChange={change}
                      disabled={disabled}
                      data-test-id="shipping-rate-name-input"
                    />
                    <Input
                      name="price"
                      type="number"
                      min={0}
                      step="0.01"
                      label={intl.formatMessage(messages.price, { currency: currencyCode })}
                      value={data.price}
                      onChange={change}
                      disabled={disabled}
                      data-test-id="shipping-rate-price-input"
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
                  disabled={
                    disabled || !data.zoneName.trim() || !data.rateName.trim() || data.price === ""
                  }
                  data-test-id="submit"
                >
                  <FormattedMessage {...messages.submit} />
                </ConfirmButton>
              </DashboardModal.Actions>
            </DashboardModal.Content>
          )}
        </Form>
      ) : null}
    </DashboardModal>
  );
};
