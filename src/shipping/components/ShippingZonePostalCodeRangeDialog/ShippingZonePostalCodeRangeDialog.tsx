import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import Grid from "@dashboard/components/Grid";
import { commonMessages } from "@dashboard/intl";
import { DialogProps, MinMax } from "@dashboard/types";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface ShippingZonePostalCodeRangeDialogProps extends DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  onSubmit: (range: MinMax) => void;
}

const useStyles = makeStyles(
  theme => ({
    info: {
      marginBottom: theme.spacing(2),
    },
  }),
  {
    name: "ShippingZonePostalCodeRangeDialog",
  },
);
const ShippingZonePostalCodeRangeDialog: React.FC<ShippingZonePostalCodeRangeDialogProps> = ({
  confirmButtonState,
  open,
  onClose,
  onSubmit,
}) => {
  const classes = useStyles({});
  const intl = useIntl();
  const initial: MinMax = {
    max: "",
    min: "",
  };

  return (
    <Dialog open={open}>
      <DialogTitle disableTypography>
        <FormattedMessage
          id="2Xt+sw"
          defaultMessage="Add postal codes"
          description="dialog header"
        />
      </DialogTitle>
      <Form initial={initial} onSubmit={onSubmit}>
        {({ change, data }) => (
          <>
            <DialogContent>
              <Text className={classes.info}>
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
            </DialogContent>
            <DialogActions>
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
            </DialogActions>
          </>
        )}
      </Form>
    </Dialog>
  );
};

ShippingZonePostalCodeRangeDialog.displayName = "ShippingZonePostalCodeRangeDialog";
export default ShippingZonePostalCodeRangeDialog;
