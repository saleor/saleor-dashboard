import { buttonLabels } from "@dashboard/extensions/messages";
import { Box, Button, TrashBinIcon } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

interface FailedInstallationActionsProps {
  onRetry: () => void;
  onDelete: () => void;
}

export const FailedInstallationActions = ({
  onRetry,
  onDelete,
}: FailedInstallationActionsProps) => {
  return (
    <Box display="flex" gap={2}>
      <Button onClick={onDelete} variant="secondary" size="small">
        <TrashBinIcon />
      </Button>
      <Button onClick={onRetry} variant="secondary" size="small">
        <FormattedMessage {...buttonLabels.retry} />
      </Button>
    </Box>
  );
};
