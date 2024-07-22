import { Button } from "@dashboard/components/Button";
import { DialogProps } from "@dashboard/types";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import { Text } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import GiftCardExportDialogContent from "../GiftCardExportDialogContent";
import { giftCardCreateMessages as messages } from "./messages";

interface GiftCardBulkCreateSuccessDialogProps extends DialogProps {
  idsToExport: string[] | null;
}

const GiftCardBulkCreateSuccessDialog: React.FC<GiftCardBulkCreateSuccessDialogProps> = ({
  open,
  onClose,
  idsToExport,
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
        <DialogTitle disableTypography>
          {intl.formatMessage(messages.bulkCreateIssuedTitle)}
        </DialogTitle>
        <DialogContent>
          <Text>{intl.formatMessage(messages.bulkCreateIssuedExplanation)}</Text>
        </DialogContent>
        <DialogActions>
          <Button variant="secondary" onClick={() => setOpenEmailExport(true)}>
            <FormattedMessage {...messages.bulkCreateIssuedExportToEmail} />
          </Button>
          <Button variant="primary" onClick={onClose}>
            <FormattedMessage {...messages.bulkCreateIssuedAccept} />
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openEmailExport} maxWidth="sm">
        <GiftCardExportDialogContent idsToExport={idsToExport} onClose={onExportDialogClose} />
      </Dialog>
    </>
  );
};

export default GiftCardBulkCreateSuccessDialog;
