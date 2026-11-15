import { LazyMetadataDialog } from "@dashboard/components/MetadataDialog/LazyMetadataDialog";
import {
  OrderFulfillmentMetadataDocument,
  type OrderFulfillmentMetadataQuery,
  type OrderFulfillmentMetadataQueryVariables,
} from "@dashboard/graphql";
import { useIntl } from "react-intl";

interface OrderFulfillmentMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  fulfillmentId: string;
}

type Fulfillment = NonNullable<OrderFulfillmentMetadataQuery["order"]>["fulfillments"][number];

export const OrderFulfillmentMetadataDialog = ({
  onClose,
  open,
  orderId,
  fulfillmentId,
}: OrderFulfillmentMetadataDialogProps): React.ReactNode => {
  const intl = useIntl();

  return (
    <LazyMetadataDialog<
      OrderFulfillmentMetadataQuery,
      OrderFulfillmentMetadataQueryVariables,
      Fulfillment
    >
      open={open}
      onClose={onClose}
      title={intl.formatMessage({
        defaultMessage: "Fulfillment Metadata",
        id: "lDdWo9",
      })}
      query={OrderFulfillmentMetadataDocument}
      variables={{ id: orderId }}
      select={data =>
        data.order?.fulfillments.find(fulfillment => fulfillment.id === fulfillmentId)
      }
    />
  );
};
