import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@material-ui/core";
import { DialogProps } from "@saleor/types";
import React from "react";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useIntl } from "react-intl";

import GiftCardExportDialogContent from "../GiftCardExportDialogContent";
import { giftCardCreateMessages as messages } from "./messages";

interface GiftCardBulkCreateSuccessDialogProps extends DialogProps {
  idsToExport: string[] | null;
}

const GiftCardBulkCreateSuccessDialog: React.FC<GiftCardBulkCreateSuccessDialogProps> = ({
  open,
  onClose,
  idsToExport
}) => {
  const intl = useIntl();
  const [openEmailExport, setOpenEmailExport] = useState(false);

  const onExportDialogClose = () => {
    setOpenEmailExport(false);
    onClose();
  };

  return (
    <>
      <Dialog open={open} maxWidth="sm">
        <DialogTitle>
          {intl.formatMessage(messages.bulkCreateIssuedTitle)}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {intl.formatMessage(messages.bulkCreateIssuedExplanation)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setOpenEmailExport(true)}
          >
            <FormattedMessage {...messages.bulkCreateIssuedExportToEmail} />
          </Button>
          <Button variant="contained" color="primary" onClick={onClose}>
            <FormattedMessage {...messages.bulkCreateIssuedAccept} />
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openEmailExport} maxWidth="sm">
        <GiftCardExportDialogContent
          idsToExport={idsToExport}
          onClose={onExportDialogClose}
        />
      </Dialog>
    </>
  );
};

export default GiftCardBulkCreateSuccessDialog;
