import { LazyMetadataDialog } from "@dashboard/components/MetadataDialog/LazyMetadataDialog";
import {
  OrderMetadataDocument,
  type OrderMetadataQuery,
  type OrderMetadataQueryVariables,
} from "@dashboard/graphql";
import { useIntl } from "react-intl";

interface OrderMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
}

export const OrderMetadataDialog = ({
  onClose,
  open,
  orderId,
}: OrderMetadataDialogProps): React.ReactNode => {
  const intl = useIntl();

  return (
    <LazyMetadataDialog<
      OrderMetadataQuery,
      OrderMetadataQueryVariables,
      NonNullable<OrderMetadataQuery["order"]>
    >
      open={open}
      onClose={onClose}
      title={intl.formatMessage({
        defaultMessage: "Order Metadata",
        id: "oL7VUz",
      })}
      query={OrderMetadataDocument}
      variables={{ id: orderId }}
      select={data => data.order}
    />
  );
};
