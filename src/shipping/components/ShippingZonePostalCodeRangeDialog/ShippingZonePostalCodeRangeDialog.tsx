import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@material-ui/core";
import BackButton from "@saleor/components/BackButton";
import ConfirmButton from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import { commonMessages } from "@saleor/intl";
import { ConfirmButtonTransitionState, makeStyles } from "@saleor/macaw-ui";
import { DialogProps, MinMax } from "@saleor/types";
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
      <DialogTitle>
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
              <Typography className={classes.info}>
                <FormattedMessage
                  id="8InCjD"
                  defaultMessage="Please provide range of postal codes you want to add to the include/exclude list."
                />
              </Typography>
              <Grid variant="uniform">
                <TextField
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

ShippingZonePostalCodeRangeDialog.displayName =
  "ShippingZonePostalCodeRangeDialog";
export default ShippingZonePostalCodeRangeDialog;
