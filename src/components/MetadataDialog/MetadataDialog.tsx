import { ButtonWithLoader } from "@dashboard/components/ButtonWithLoader/ButtonWithLoader";
import ExitFormDialog from "@dashboard/components/Form/ExitFormDialog";
import { MetadataCard } from "@dashboard/components/Metadata/MetadataCard";
import { MetadataLoadingCard } from "@dashboard/components/Metadata/MetadataLoadingCard";
import { DashboardModal } from "@dashboard/components/Modal";
import { type MetadataInput } from "@dashboard/graphql";
import { type ChangeEvent } from "@dashboard/hooks/useForm";
import { buttonMessages, commonMessages } from "@dashboard/intl";
import { Box, Button } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface MetadataDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  title?: string;
  data: {
    metadata: MetadataInput[];
    privateMetadata: MetadataInput[];
  };
  onChange: (event: ChangeEvent, isPrivate: boolean) => void;
  loading?: boolean;
  /** Shows skeleton cards while the metadata is being fetched (e.g. lazily loaded dialogs) */
  contentLoading?: boolean;
  disabled?: boolean;
  errors?: {
    metadata?: string;
    privateMetadata?: string;
  };
  formIsDirty?: boolean;
}

export const MetadataDialog = ({
  open,
  onClose,
  onSave,
  title,
  data,
  onChange,
  loading = false,
  contentLoading = false,
  disabled = false,
  errors = {},
  formIsDirty = false,
}: MetadataDialogProps) => {
  const intl = useIntl();
  const [showExitDialog, setShowExitDialog] = useState(false);

  const handleClose = () => {
    if (formIsDirty) {
      setShowExitDialog(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = () => {
    setShowExitDialog(false);
    onClose();
  };

  return (
    <DashboardModal open={open} onChange={handleClose}>
      <DashboardModal.Content size="md">
        <DashboardModal.Header>
          {title ?? intl.formatMessage(commonMessages.metadata)}
        </DashboardModal.Header>

        <DashboardModal.Body>
          <DashboardModal.Inset>
            <Box display="flex" flexDirection="column">
              {contentLoading ? (
                <>
                  <MetadataLoadingCard inModal marginTop={0} />
                  <MetadataLoadingCard isPrivate inModal />
                </>
              ) : (
                <>
                  <MetadataCard
                    inModal
                    marginTop={0}
                    data={data.metadata}
                    isPrivate={false}
                    disabled={disabled || loading}
                    onChange={event => onChange(event, false)}
                    error={errors.metadata}
                  />

                  <MetadataCard
                    inModal
                    data={data.privateMetadata}
                    isPrivate={true}
                    disabled={disabled || loading}
                    onChange={event => onChange(event, true)}
                    error={errors.privateMetadata}
                  />
                </>
              )}
            </Box>
          </DashboardModal.Inset>
        </DashboardModal.Body>

        <DashboardModal.Actions>
          <Button data-test-id="back" variant="secondary" onClick={handleClose}>
            <FormattedMessage {...buttonMessages.close} />
          </Button>
          <ButtonWithLoader
            transitionState={loading ? "loading" : "default"}
            data-test-id="save"
            variant="primary"
            disabled={loading || disabled || !formIsDirty}
            onClick={onSave}
          >
            <FormattedMessage {...buttonMessages.save} />
          </ButtonWithLoader>
        </DashboardModal.Actions>
      </DashboardModal.Content>

      <ExitFormDialog
        isOpen={showExitDialog}
        onClose={() => setShowExitDialog(false)}
        onLeave={handleConfirmClose}
      />
    </DashboardModal>
  );
};
