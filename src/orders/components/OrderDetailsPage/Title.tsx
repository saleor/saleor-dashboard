import { ClickableChannel } from "@dashboard/components/Channel/Channel";
import { MerchantDate } from "@dashboard/components/Date/MerchantDate";
import { Pill } from "@dashboard/components/Pill";
import { type OrderDetailsFragment, OrderStatus } from "@dashboard/graphql";
import { transformOrderStatus } from "@dashboard/misc";
import { rippleOrderChannelInHeader } from "@dashboard/orders/ripples/orderChannelInHeader";
import { Ripple } from "@dashboard/ripples/components/Ripple";
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
  const dateKind = order.status === OrderStatus.UNCONFIRMED ? "created" : "placed";

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
          <Box display="inline-flex" alignItems="center">
            <MerchantDate kind={dateKind} date={order.created} />
            {order.channel && (
              <Text as="span" size={3} fontWeight="regular" color="default2">
                ,
              </Text>
            )}
          </Box>
        ) : (
          <Skeleton __width="10em" />
        )}
        {order?.channel && (
          <Box
            position="relative"
            display="inline-flex"
            alignItems="center"
            __height="30px"
            paddingRight={5}
          >
            <ClickableChannel channel={order.channel} size={3} />
            <Box
              position="absolute"
              __top="0"
              __right="0"
              __width="30px"
              __height="30px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Ripple model={rippleOrderChannelInHeader} />
            </Box>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default Title;
