import { Container, Typography } from "@material-ui/core";
import { Backlink } from "@saleor/components/Backlink";
import PageHeader from "@saleor/components/PageHeader";
import { OrderDetailsFragment } from "@saleor/graphql";
import { buttonMessages } from "@saleor/intl";
import { orderUrl } from "@saleor/orders/urls";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { grantRefundPageMessages } from "./messages";

export interface OrderGrantRefundPageProps {
  order: OrderDetailsFragment;
  loading: boolean;
}

const OrderGrantRefundPage: React.FC<OrderGrantRefundPageProps> = ({
  order,
  loading,
}) => {
  const intl = useIntl();

  return (
    <Container>
      <Backlink href={orderUrl(order?.id)}>
        <FormattedMessage {...buttonMessages.back} />
      </Backlink>
      <PageHeader
        title={<FormattedMessage {...grantRefundPageMessages.pageHeader} />}
      />
      <Typography variant="subtitle2">
        <FormattedMessage {...grantRefundPageMessages.pageSubtitle} />
      </Typography>
    </Container>
  );
};

export default OrderGrantRefundPage;
