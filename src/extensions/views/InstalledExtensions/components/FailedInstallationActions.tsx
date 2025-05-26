import { buttonLabels } from "@dashboard/extensions/messages";
import { RetryIcon } from "@dashboard/icons/RetryIcon";
import { Box, Button, TrashBinIcon } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

interface FailedInstallationActionsProps {
  onRetry: () => void;
  onDelete: () => void;
}

export const FailedInstallationActions = ({
  onRetry,
  onDelete,
}: FailedInstallationActionsProps) => {
  const intl = useIntl();

  return (
    <Box display="flex" gap={2}>
      <Button
        onClick={onDelete}
        variant="secondary"
        size="small"
        title={intl.formatMessage(buttonLabels.remove)}
      >
        <TrashBinIcon />
      </Button>
      <Button onClick={onRetry} variant="secondary" size="small">
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          __width="18px"
          title={intl.formatMessage(buttonLabels.retry)}
        >
          <RetryIcon />
        </Box>
      </Button>
    </Box>
  );
};
