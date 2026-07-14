import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { commonMessages } from "@dashboard/intl";
import { type DialogProps, type MinMax } from "@dashboard/types";
import { Box, Input } from "@saleor/macaw-ui-next";
import { type ChangeEvent, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";

interface ShippingZonePostalCodeRangeDialogProps extends DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  onSubmit: (range: MinMax) => void;
}

const emptyRange: MinMax = {
  max: "",
  min: "",
};

export const ShippingZonePostalCodeRangeDialog = ({
  confirmButtonState,
  open,
  onClose,
  onSubmit,
}: ShippingZonePostalCodeRangeDialogProps) => {
  const intl = useIntl();
  const [data, setData] = useState<MinMax>(emptyRange);
  const resetForm = () => {
    setData(emptyRange);
  };
  const handleClose = () => {
    resetForm();
    onClose();
  };
  const handleSubmit = () => {
    onSubmit(data);
  };
  const handleFieldChange = (field: keyof MinMax) => (event: ChangeEvent<HTMLInputElement>) => {
    setData(currentData => ({
      ...currentData,
      [field]: event.target.value,
    }));
  };

  useModalDialogOpen(open, {
    onOpen: resetForm,
  });

  return (
    <DashboardModal onChange={handleClose} open={open}>
      <DashboardModal.Content size="sm">
        <DashboardModal.Header
          subtitle={
            <FormattedMessage
              id="8InCjD"
              defaultMessage="Please provide range of postal codes you want to add to the include/exclude list."
            />
          }
        >
          {intl.formatMessage(messages.title)}
        </DashboardModal.Header>

        <DashboardModal.Body>
          <DashboardModal.Inset>
            <Box display="grid" gridTemplateColumns={2} gap={4}>
              <Input
                data-test-id="zip-code-starts-with-input"
                label={intl.formatMessage(messages.postalCodeStartLabel)}
                name="min"
                value={data.min}
                onChange={handleFieldChange("min")}
              />
              <Input
                data-test-id="zip-code-ends-with-input"
                helperText={intl.formatMessage(commonMessages.optionalField)}
                label={intl.formatMessage(messages.postalCodeEndLabel)}
                name="max"
                value={data.max}
                onChange={handleFieldChange("max")}
              />
            </Box>
          </DashboardModal.Inset>
        </DashboardModal.Body>

        <DashboardModal.Actions>
          <BackButton onClick={handleClose} />
          <ConfirmButton
            disabled={!data.min.trim()}
            transitionState={confirmButtonState}
            data-test-id="submit"
            onClick={handleSubmit}
          >
            {intl.formatMessage(messages.addButton)}
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

ShippingZonePostalCodeRangeDialog.displayName = "ShippingZonePostalCodeRangeDialog";
