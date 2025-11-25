import { ButtonWithLoader } from "@dashboard/components/ButtonWithLoader/ButtonWithLoader";
import { MetadataCard } from "@dashboard/components/Metadata/MetadataCard";
import { DashboardModal } from "@dashboard/components/Modal";
import { MetadataInput } from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { buttonMessages, commonMessages } from "@dashboard/intl";
import { Box, Button } from "@saleor/macaw-ui-next";
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
  disabled = false,
  errors = {},
  formIsDirty = false,
}: MetadataDialogProps) => {
  const intl = useIntl();

  return (
    <DashboardModal open={open} onChange={onClose}>
      <DashboardModal.Content size="md" overflowY="hidden">
        <DashboardModal.Header paddingLeft={6}>
          {title ?? intl.formatMessage(commonMessages.metadata)}
        </DashboardModal.Header>

        {/* This is scroll container so that Save and title are always visible */}
        <Box
          style={{
            // Max height calculated so that there's no scroll on modal itself
            maxHeight: "calc(-320px + 100vh)",
            // Remove right margin (DashboardModal.Content has 6 units padding)
            // It has to be removed to avoid spacing out horizontal scroll in weird way
            marginRight: "calc(var(--mu-spacing-6) * -1)",
          }}
          // Re-add back removed padding via negative marginRight
          paddingRight={6}
          overflowY="auto"
        >
          <Box display="flex" flexDirection="column" gap={2}>
            <MetadataCard
              data={data.metadata}
              isPrivate={false}
              disabled={disabled || loading}
              onChange={event => onChange(event, false)}
              error={errors.metadata}
            />

            <MetadataCard
              data={data.privateMetadata}
              isPrivate={true}
              disabled={disabled || loading}
              onChange={event => onChange(event, true)}
              error={errors.privateMetadata}
            />
          </Box>
        </Box>

        <DashboardModal.Actions
          paddingTop={4}
          paddingX={6}
          bottom={6}
          width="100%"
          backgroundColor="default1"
        >
          <Button data-test-id="back" variant="secondary" onClick={onClose}>
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
    </DashboardModal>
  );
};
