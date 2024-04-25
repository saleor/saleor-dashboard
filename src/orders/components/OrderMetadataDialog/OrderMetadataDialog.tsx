import { Metadata } from "@dashboard/components/Metadata";
import { DashboardModal } from "@dashboard/components/Modal";
import { OrderLineWithMetadataFragment } from "@dashboard/graphql";
import { buttonMessages, commonMessages } from "@dashboard/intl";
import { Button } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

interface OrderMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  data?: OrderLineWithMetadataFragment;
}

export const OrderMetadataDialog = ({ onClose, open, data }: OrderMetadataDialogProps) => {
  return (
    <DashboardModal open={open} onChange={onClose}>
      <DashboardModal.Content
        __maxHeight="90vh"
        __width="min(850px, 90vw)"
        overflowY="auto"
        gap={0}
        paddingX={0}
      >
        <DashboardModal.Title paddingX={6}>
          <FormattedMessage {...commonMessages.metadata} />: {data?.productName ?? ""}
        </DashboardModal.Title>

        <Metadata
          readonly={true}
          onChange={() => undefined}
          data={{
            metadata: data?.variant?.metadata ?? [],
            privateMetadata: data?.variant?.privateMetadata ?? [],
          }}
        />

        <DashboardModal.Actions paddingX={6}>
          <Button data-test-id="back" variant="secondary" onClick={onClose}>
            <FormattedMessage {...buttonMessages.close} />
          </Button>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
