import { Channel } from "@dashboard/components/Channel/Channel";
import { DateTime } from "@dashboard/components/Date/DateTime";
import { Pill } from "@dashboard/components/Pill";
import { type OrderDetailsFragment } from "@dashboard/graphql";
import { transformOrderStatus } from "@dashboard/misc";
import { orderListUrlWithChannel } from "@dashboard/orders/urls";
import { makeStyles } from "@saleor/macaw-ui";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

interface TitleProps {
  order?: OrderDetailsFragment;
}

const useStyles = makeStyles(
  theme => ({
    container: {
      alignItems: "center",
      display: "flex",
      gap: theme.spacing(2),
    },
    statusContainer: {
      marginLeft: theme.spacing(2),
    },
  }),
  { name: "OrderDetailsTitle" },
);
const Title = (props: TitleProps) => {
  const intl = useIntl();
  const classes = useStyles(props);
  const { order } = props;

  if (!order) {
    return (
      <div className={classes.container}>
        <Skeleton __width="8em" />
        <Skeleton __width="10em" />
      </div>
    );
  }

  const { localized, status } = transformOrderStatus(order.status, intl);

  return (
    <div className={classes.container}>
      <Box display="flex" justifyContent="center" alignItems="center">
        {intl.formatMessage(
          { id: "AqXzM2", defaultMessage: "Order #{orderNumber}" },
          { orderNumber: order?.number },
        )}
        <div className={classes.statusContainer}>
          <Pill data-test-id="status-info" label={localized} color={status} />
        </div>
      </Box>

      <Box display="flex" alignItems="center" gap={1.5}>
        {order && order.created ? (
          <Text size={3} fontWeight="regular" color="default2">
            <DateTime date={order.created} plain />
            {order.channel && ","}
          </Text>
        ) : (
          <Skeleton __width="10em" />
        )}
        {order?.channel && (
          <Channel channel={order.channel} href={orderListUrlWithChannel(order.channel)} size={3} />
        )}
      </Box>
    </div>
  );
};

export default Title;
