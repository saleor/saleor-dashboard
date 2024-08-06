import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import Grid from "@dashboard/components/Grid";
import { DashboardModal } from "@dashboard/components/Modal";
import { commonMessages } from "@dashboard/intl";
import { DialogProps, MinMax } from "@dashboard/types";
import { TextField } from "@material-ui/core";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface ShippingZonePostalCodeRangeDialogProps extends DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  onSubmit: (range: MinMax) => void;
}

const ShippingZonePostalCodeRangeDialog: React.FC<ShippingZonePostalCodeRangeDialogProps> = ({
  confirmButtonState,
  open,
  onClose,
  onSubmit,
}) => {
  const intl = useIntl();
  const initial: MinMax = {
    max: "",
    min: "",
  };

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="md">
        <Form initial={initial} onSubmit={onSubmit}>
          {({ change, data }) => (
            <DashboardModal.Grid>
              <DashboardModal.Title>
                <FormattedMessage
                  id="2Xt+sw"
                  defaultMessage="Add postal codes"
                  description="dialog header"
                />
              </DashboardModal.Title>

              <Text>
                <FormattedMessage
                  id="8InCjD"
                  defaultMessage="Please provide range of postal codes you want to add to the include/exclude list."
                />
              </Text>

              <Grid variant="uniform">
                <TextField
                  data-test-id="zip-code-starts-with-input"
                  label={intl.formatMessage({
                    id: "1T1fP8",
                    defaultMessage: "Postal codes (start)",
                    description: "range input label",
                  })}
                  name="min"
                  value={data.min}
                  onChange={change}
                />
                <TextField
                  data-test-id="zip-code-ends-with-input"
                  label={intl.formatMessage({
                    id: "axFFaD",
                    defaultMessage: "Postal codes (end)",
                    description: "range input label",
                  })}
                  name="max"
                  helperText={intl.formatMessage(commonMessages.optionalField)}
                  value={data.max}
                  onChange={change}
                />
              </Grid>

              <DashboardModal.Actions>
                <BackButton onClick={onClose} />
                <ConfirmButton
                  disabled={!data.min}
                  transitionState={confirmButtonState}
                  type="submit"
                  data-test-id="submit"
                >
                  <FormattedMessage
                    id="DM/Ha1"
                    defaultMessage="Add"
                    description="add postal code range, button"
                  />
                </ConfirmButton>
              </DashboardModal.Actions>
            </DashboardModal.Grid>
          )}
        </Form>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

ShippingZonePostalCodeRangeDialog.displayName = "ShippingZonePostalCodeRangeDialog";
export default ShippingZonePostalCodeRangeDialog;
