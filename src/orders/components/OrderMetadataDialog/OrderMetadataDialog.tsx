import { MetadataFormData } from "@dashboard/components/Metadata";
import { MetadataDialog } from "@dashboard/components/MetadataDialog";
import { OrderDetailsQuery } from "@dashboard/graphql";
import { mapMetadataItemToInput } from "@dashboard/utils/maps";
import { useIntl } from "react-intl";

import { useHandleOrderMetadataSubmit } from "./useHandleSubmit";

export type OrderMetadataDialogData = NonNullable<OrderDetailsQuery["order"]>;

interface OrderMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  order: OrderMetadataDialogData | undefined;
}

export const OrderMetadataDialog = ({ onClose, open, order }: OrderMetadataDialogProps) => {
  const intl = useIntl();
  const { onSubmit, lastSubmittedData, submitInProgress } = useHandleOrderMetadataSubmit({
    initialData: order,
    onClose,
  });

  // Display last submitted data while re-fetching to avoid flicker on UI
  const data: MetadataFormData = submitInProgress
    ? (lastSubmittedData ?? {
        metadata: [],
        privateMetadata: [],
      })
    : {
        // Removes __typename from metadata item object
        metadata: (order?.metadata ?? []).map(mapMetadataItemToInput),
        privateMetadata: (order?.privateMetadata ?? []).map(mapMetadataItemToInput),
      };

  return (
    <MetadataDialog
      open={open}
      onClose={onClose}
      onSave={onSubmit}
      title={intl.formatMessage({
        defaultMessage: "Order Metadata",
        id: "oL7VUz",
      })}
      data={data}
      loading={submitInProgress}
    />
  );
};
