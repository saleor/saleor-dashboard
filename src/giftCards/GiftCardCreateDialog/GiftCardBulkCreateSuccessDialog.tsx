import { DashboardModal } from "@dashboard/components/Modal";
import { DialogProps } from "@dashboard/types";
import { Button, Text } from "@saleor/macaw-ui-next";
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
      <DashboardModal open={open} onChange={onClose}>
        <DashboardModal.Content size="sm">
          <DashboardModal.Header onClose={onClose}>
            {intl.formatMessage(messages.bulkCreateIssuedTitle)}
          </DashboardModal.Header>

          <Text>{intl.formatMessage(messages.bulkCreateIssuedExplanation)}</Text>

          <DashboardModal.Actions>
            <Button variant="secondary" onClick={() => setOpenEmailExport(true)}>
              <FormattedMessage {...messages.bulkCreateIssuedExportToEmail} />
            </Button>
            <Button variant="primary" onClick={onClose}>
              <FormattedMessage {...messages.bulkCreateIssuedAccept} />
            </Button>
          </DashboardModal.Actions>
        </DashboardModal.Content>
      </DashboardModal>

      <DashboardModal onChange={onExportDialogClose} open={openEmailExport}>
        <GiftCardExportDialogContent idsToExport={idsToExport} onClose={onExportDialogClose} />
      </DashboardModal>
    </>
  );
};

export default GiftCardBulkCreateSuccessDialog;
