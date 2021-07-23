import PageTitleWithStatusChip from "@saleor/components/PageTitleWithStatusChip";
import { transformOrderStatus } from "@saleor/misc";
import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";
import React from "react";
import { useIntl } from "react-intl";

interface TitleProps {
  order?: OrderDetails_order;
}

const Title: React.FC<TitleProps> = ({ order }) => {
  const intl = useIntl();

  if (!order) {
    return null;
  }

  const { localized, status } = transformOrderStatus(order.status, intl);

  return (
    <PageTitleWithStatusChip
      title={order?.number}
      statusLabel={localized}
      statusType={status}
    />
  );
};

export default Title;
