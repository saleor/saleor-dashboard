import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import { buttonMessages, commonMessages } from "@saleor/intl";
import { DialogProps, MinMax } from "@saleor/types";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface ShippingZoneZipCodeRangeDialogProps extends DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  onSubmit: (range: MinMax) => void;
}

const useStyles = makeStyles(
  theme => ({
    info: {
      marginBottom: theme.spacing(2)
    }
  }),
  {
    name: "ShippingZoneZipCodeRangeDialog"
  }
);

const ShippingZoneZipCodeRangeDialog: React.FC<ShippingZoneZipCodeRangeDialogProps> = ({
  confirmButtonState,
  open,
  onClose,
  onSubmit
}) => {
  const classes = useStyles({});
  const intl = useIntl();

  const initial: MinMax = {
    max: "",
    min: ""
  };

  return (
    <Dialog open={open}>
      <DialogTitle>
        <FormattedMessage
          defaultMessage="Add ZIP-Codes"
          description="dialog header"
        />
      </DialogTitle>
      <Form initial={initial} onSubmit={onSubmit}>
        {({ change, data, hasChanged }) => (
          <>
            <DialogContent>
              <Typography className={classes.info}>
                <FormattedMessage defaultMessage="Please provide range of ZIP codes you want to add to the include/exclude list." />
              </Typography>
              <Grid variant="uniform">
                <TextField
                  label={intl.formatMessage({
                    defaultMessage: "Zip Codes (Start)",
                    description: "range input label"
                  })}
                  name="min"
                  value={data.min}
                  onChange={change}
                />
                <TextField
                  label={intl.formatMessage({
                    defaultMessage: "Zip Codes (End)",
                    description: "range input label"
                  })}
                  name="max"
                  helperText={intl.formatMessage(commonMessages.optionalField)}
                  value={data.max}
                  onChange={change}
                />
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>
                <FormattedMessage {...buttonMessages.back} />
              </Button>
              <ConfirmButton
                disabled={!hasChanged || !data.min}
                transitionState={confirmButtonState}
                type="submit"
              >
                <FormattedMessage
                  defaultMessage="Add"
                  description="add zip code range, button"
                />
              </ConfirmButton>
            </DialogActions>
          </>
        )}
      </Form>
    </Dialog>
  );
};

ShippingZoneZipCodeRangeDialog.displayName = "ShippingZoneZipCodeRangeDialog";
export default ShippingZoneZipCodeRangeDialog;
