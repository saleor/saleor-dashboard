import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@material-ui/core";
import React from "react";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useIntl } from "react-intl";

import GiftCardExportDialog from "../GiftCardExportDialog";
import { giftCardCreateMessages as messages } from "./messages";

interface GiftCardCreateSuccessDialogProps {
  open: boolean;
  onClose: () => void;
  idsToExport: string[] | null;
}

const GiftCardCreateSuccessDialog: React.FC<GiftCardCreateSuccessDialogProps> = ({
  open,
  onClose,
  idsToExport
}) => {
  const intl = useIntl();
  const [openEmailExport, setOpenEmailExport] = useState<boolean>(false);

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
      <GiftCardExportDialog
        idsToExport={idsToExport}
        onClose={onExportDialogClose}
        open={openEmailExport}
      />
    </>
  );
};

export default GiftCardCreateSuccessDialog;
