import { Metadata } from "@dashboard/components/Metadata";
import { DashboardModal } from "@dashboard/components/Modal";
import { OrderLineWithMetadataFragment } from "@dashboard/graphql";
import { buttonMessages, commonMessages } from "@dashboard/intl";
import { useHasManageProductsPermission } from "@dashboard/orders/hooks/useHasManageProductsPermission";
import { Button } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

interface OrderMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  data?: OrderLineWithMetadataFragment;
  loading?: boolean;
}

export const OrderMetadataDialog = ({ onClose, open, data, loading }: OrderMetadataDialogProps) => {
  const hasManageProducts = useHasManageProductsPermission();

  return (
    <DashboardModal open={open} onChange={onClose}>
      <DashboardModal.Content size="md">
        <DashboardModal.Header paddingX={6}>
          <FormattedMessage {...commonMessages.metadata} />: {data?.productName ?? ""}
        </DashboardModal.Header>

        <Metadata
          readonly={true}
          onChange={() => undefined}
          isLoading={loading}
          data={{
            metadata: data?.variant?.metadata ?? [],
            privateMetadata: data?.variant?.privateMetadata,
          }}
          hidePrivateMetadata={!hasManageProducts}
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
