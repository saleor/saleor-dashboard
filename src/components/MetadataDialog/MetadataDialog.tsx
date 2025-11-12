import { ButtonWithLoader } from "@dashboard/components/ButtonWithLoader/ButtonWithLoader";
import { MetadataCard } from "@dashboard/components/Metadata/MetadataCard";
import { MetadataLoadingCard } from "@dashboard/components/Metadata/MetadataLoadingCard";
import { DashboardModal } from "@dashboard/components/Modal";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { buttonMessages } from "@dashboard/intl";
import { Box, Button } from "@saleor/macaw-ui-next";
import { ReactNode } from "react";
import { FieldArrayWithId } from "react-hook-form";
import { FormattedMessage } from "react-intl";

import { MetadataFormData } from "../Metadata/types";
import { mapFieldArrayToMetadataInput } from "./utils";

interface MetadataDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: ReactNode;
  loading: boolean;
  submitInProgress: boolean;
  isDirty: boolean;
  metadataFields: FieldArrayWithId<MetadataFormData, "metadata", "id">[];
  privateMetadataFields: FieldArrayWithId<MetadataFormData, "privateMetadata", "id">[];
  handleMetadataChange: (event: ChangeEvent) => void;
  handlePrivateMetadataChange: (event: ChangeEvent) => void;
  metadataErrors: string[];
  privateMetadataErrors: string[];
  size?: "sm" | "md" | "lg";
}

export const MetadataDialog = ({
  open,
  onClose,
  onSubmit,
  title,
  loading,
  submitInProgress,
  isDirty,
  metadataFields,
  privateMetadataFields,
  handleMetadataChange,
  handlePrivateMetadataChange,
  metadataErrors,
  privateMetadataErrors,
  size = "md",
}: MetadataDialogProps) => {
  return (
    <DashboardModal open={open} onChange={onClose}>
      <DashboardModal.Content size={size} overflowY="hidden">
        <DashboardModal.Title>{title}</DashboardModal.Title>

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
          <Box as="form" onSubmit={onSubmit}>
            {loading ? (
              <Box display="grid" gap={2}>
                <MetadataLoadingCard />
                <MetadataLoadingCard isPrivate />
              </Box>
            ) : (
              <Box display="grid" gap={2}>
                <MetadataCard
                  data={mapFieldArrayToMetadataInput(metadataFields)}
                  isPrivate={false}
                  disabled={loading || submitInProgress}
                  onChange={handleMetadataChange}
                  error={metadataErrors.length ? metadataErrors.join(", ") : undefined}
                />

                <MetadataCard
                  data={mapFieldArrayToMetadataInput(privateMetadataFields)}
                  isPrivate={true}
                  disabled={loading || submitInProgress}
                  onChange={handlePrivateMetadataChange}
                  error={
                    privateMetadataErrors.length ? privateMetadataErrors.join(", ") : undefined
                  }
                />
              </Box>
            )}
          </Box>
        </Box>

        <DashboardModal.Actions
          paddingTop={4}
          paddingX={6}
          bottom={6}
          width="100%"
          backgroundColor="default1"
        >
          <ButtonWithLoader
            transitionState={submitInProgress ? "loading" : "default"}
            data-test-id="save"
            variant="primary"
            disabled={submitInProgress || !isDirty}
            type="submit"
            onClick={onSubmit}
          >
            <FormattedMessage {...buttonMessages.save} />
          </ButtonWithLoader>
          <Button data-test-id="back" variant="secondary" onClick={onClose}>
            <FormattedMessage {...buttonMessages.close} />
          </Button>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
