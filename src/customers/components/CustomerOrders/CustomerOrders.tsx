import { AssignableListCard } from "@dashboard/components/AssignableListTable/AssignableListCard";
import {
  AssignableListCell,
  AssignableListTable,
} from "@dashboard/components/AssignableListTable/AssignableListTable";
import { ASSIGNABLE_LIST_TABLE_CARD_LEADING_INSET } from "@dashboard/components/AssignableListTable/assignableListTableLayout";
import { ChannelDisplay } from "@dashboard/components/Channel/Channel";
import { DateTime } from "@dashboard/components/Date/DateTime";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import Money from "@dashboard/components/Money";
import { Pill } from "@dashboard/components/Pill/Pill";
import { type CustomerDetailsQuery, type OrderStatus } from "@dashboard/graphql";
import { transformOrderStatus } from "@dashboard/misc";
import { orderUrl } from "@dashboard/orders/urls";
import { type RelayToFlat } from "@dashboard/types";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { ShoppingCart } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { messages } from "./messages";

type CustomerRecentOrder = NonNullable<
  RelayToFlat<NonNullable<NonNullable<CustomerDetailsQuery["user"]>["orders"]>>
>[number];

interface CustomerOrdersProps {
  orders: Array<CustomerRecentOrder | null | undefined> | undefined;
  viewAllHref: string;
}

const OrderStatusPill = ({ status }: { status: OrderStatus }): JSX.Element => {
  const intl = useIntl();
  const { localized, status: color } = transformOrderStatus(status, intl);

  return <Pill label={localized} color={color} data-test-id="customer-order-status" />;
};

export const CustomerOrders = ({ orders, viewAllHref }: CustomerOrdersProps): JSX.Element => {
  return (
    <AssignableListCard
      data-test-id="customer-orders"
      title={<FormattedMessage {...messages.title} />}
      headerEnd={
        orders === undefined ? (
          <Button variant="secondary" disabled>
            <FormattedMessage {...messages.viewAll} />
          </Button>
        ) : (
          <Link to={viewAllHref}>
            <Button variant="secondary">
              <FormattedMessage {...messages.viewAll} />
            </Button>
          </Link>
        )
      }
    >
      <AssignableListTable<CustomerRecentOrder>
        data-test-id="customer-orders-table"
        rowTestId="customer-order-row"
        items={orders}
        selection="none"
        getRowHref={order => orderUrl(order.id)}
        getRowLabel={order => `#${order.number}`}
        leadingInset={ASSIGNABLE_LIST_TABLE_CARD_LEADING_INSET}
        emptyMessage={<FormattedMessage {...messages.empty} />}
        emptyIcon={
          <Box color="default2" display="flex" aria-hidden>
            <ShoppingCart size={iconSize.large} strokeWidth={iconStrokeWidthBySize.large} />
          </Box>
        }
        columns={[
          {
            id: "number",
            width: "16%",
            header: <FormattedMessage {...messages.orderColumn} />,
          },
          {
            id: "date",
            width: "22%",
            header: <FormattedMessage {...messages.dateColumn} />,
          },
          {
            id: "status",
            width: "22%",
            header: <FormattedMessage {...messages.statusColumn} />,
          },
          {
            id: "total",
            width: "18%",
            align: "end",
            header: <FormattedMessage {...messages.totalColumn} />,
          },
          {
            id: "channel",
            width: "22%",
            header: <FormattedMessage {...messages.channelColumn} />,
          },
        ]}
        renderCells={order => (
          <>
            <AssignableListCell truncate>
              <Text ellipsis display="block" size={2}>
                #{order.number}
              </Text>
            </AssignableListCell>
            <AssignableListCell truncate>
              <DateTime date={order.created} plain />
            </AssignableListCell>
            <AssignableListCell>
              <OrderStatusPill status={order.status} />
            </AssignableListCell>
            <AssignableListCell align="end">
              {order.total.gross ? <Money money={order.total.gross} /> : "-"}
            </AssignableListCell>
            <AssignableListCell truncate>
              <ChannelDisplay channel={order.channel ?? undefined} size={2} />
            </AssignableListCell>
          </>
        )}
      />
    </AssignableListCard>
  );
};

CustomerOrders.displayName = "CustomerOrders";
