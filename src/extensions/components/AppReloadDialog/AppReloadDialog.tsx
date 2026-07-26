import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { getStringOrPlaceholder } from "@dashboard/misc";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import { lazy, Suspense } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import msgs from "./messages";

// @pierre/diffs bundles shiki — load it only when the dialog actually renders
// a diff so it stays out of the main chunk.
const ManifestDiff = lazy(() =>
  import("./ManifestDiff").then(module => ({ default: module.ManifestDiff })),
);

export interface AppReloadPreview {
  currentManifest: string;
  incomingManifest: string;
}

interface AppReloadDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  name?: string | null;
  previewLoading: boolean;
  previewError: string | null;
  preview: AppReloadPreview | null;
  onClose: () => void;
  onConfirm: () => void;
}

const LoadingSkeleton = () => (
  <Box data-test-id="reload-dialog-loading">
    <Skeleton height={8} marginBottom={4} />
    <Skeleton height={8} marginBottom={4} />
    <Skeleton height={8} />
  </Box>
);

export const AppReloadDialog = ({
  confirmButtonState,
  open,
  name,
  previewLoading,
  previewError,
  preview,
  onClose,
  onConfirm,
}: AppReloadDialogProps) => {
  const intl = useIntl();
  const isSubmitting = confirmButtonState === "loading";
  const hasChanges = !!preview && preview.currentManifest !== preview.incomingManifest;
  const canConfirm = !previewLoading && !previewError && hasChanges;

  const handleClose = (): void => {
    if (isSubmitting) {
      return;
    }

    onClose();
  };

  const getContent = () => {
    if (previewLoading) {
      return <LoadingSkeleton />;
    }

    if (previewError) {
      return (
        <Box data-test-id="reload-dialog-error" display="flex" flexDirection="column" gap={2}>
          <Text color="critical1">
            <FormattedMessage {...msgs.fetchError} />
          </Text>
          <Text color="critical1">{previewError}</Text>
        </Box>
      );
    }

    if (!hasChanges) {
      return (
        <Text data-test-id="reload-dialog-up-to-date">
          <FormattedMessage {...msgs.upToDate} />
        </Text>
      );
    }

    return (
      <Box
        data-test-id="reload-dialog-diff"
        display="flex"
        flexDirection="column"
        gap={4}
        __minWidth={0}
        __maxWidth="100%"
      >
        <Box backgroundColor="warning1" padding={3} borderRadius={3}>
          <Text size={3}>
            <FormattedMessage {...msgs.reloadWarning} />
          </Text>
        </Box>
        <Box overflowX="auto" overflowY="auto" __minWidth={0} __maxWidth="100%" __maxHeight="60vh">
          <Suspense fallback={<LoadingSkeleton />}>
            <ManifestDiff
              currentManifest={preview.currentManifest}
              incomingManifest={preview.incomingManifest}
            />
          </Suspense>
        </Box>
      </Box>
    );
  };

  return (
    <DashboardModal onChange={handleClose} open={open}>
      <DashboardModal.Content size="md">
        <DashboardModal.Header
          subtitle={
            <Box data-test-id="dialog-content">
              {intl.formatMessage(msgs.reloadAppDescription, {
                name: <strong>{getStringOrPlaceholder(name)}</strong>,
              })}
            </Box>
          }
        >
          <FormattedMessage {...msgs.reloadAppTitle} />
        </DashboardModal.Header>

        <Box paddingY={4}>{getContent()}</Box>
        <DashboardModal.Actions>
          <BackButton disabled={isSubmitting} onClick={handleClose} />
          <ConfirmButton
            data-test-id="submit"
            disabled={isSubmitting || !canConfirm}
            onClick={onConfirm}
            transitionState={confirmButtonState}
          >
            <FormattedMessage {...buttonMessages.reload} />
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

AppReloadDialog.displayName = "AppReloadDialog";
