import BackButton from "@dashboard/components/BackButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { GiftCardExportDialogContent } from "@dashboard/giftCards/GiftCardExportDialogContent/GiftCardExportDialogContent";
import { type DialogProps } from "@dashboard/types";
import { Button } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

import { giftCardBulkCreateDialogMessages as messages } from "../GiftCardBulkCreateDialog/messages";

interface GiftCardBulkCreateSuccessDialogProps extends DialogProps {
  idsToExport: string[] | null;
}

export const GiftCardBulkCreateSuccessDialog = ({
  idsToExport,
  onClose,
  open,
}: GiftCardBulkCreateSuccessDialogProps) => {
  const [openEmailExport, setOpenEmailExport] = useState(false);

  const handleExportDialogClose = (): void => {
    setOpenEmailExport(false);
    onClose();
  };

  const handleClose = (): void => {
    setOpenEmailExport(false);
    onClose();
  };

  return (
    <>
      <DashboardModal onChange={handleClose} open={open}>
        {open ? (
          <DashboardModal.Content size="sm">
            <DashboardModal.ContextHeader
              description={<FormattedMessage {...messages.successDescription} />}
            >
              <FormattedMessage {...messages.successTitle} />
            </DashboardModal.ContextHeader>

            <DashboardModal.Actions>
              <BackButton onClick={handleClose}>
                <FormattedMessage {...messages.successClose} />
              </BackButton>
              <Button onClick={() => setOpenEmailExport(true)} variant="primary">
                <FormattedMessage {...messages.successExportToEmail} />
              </Button>
            </DashboardModal.Actions>
          </DashboardModal.Content>
        ) : null}
      </DashboardModal>

      <GiftCardExportDialogContent
        idsToExport={idsToExport}
        onClose={handleExportDialogClose}
        open={openEmailExport}
      />
    </>
  );
};

GiftCardBulkCreateSuccessDialog.displayName = "GiftCardBulkCreateSuccessDialog";
