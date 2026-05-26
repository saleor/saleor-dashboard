import { MerchantDate } from "@dashboard/components/Date/MerchantDate";
import { Pill } from "@dashboard/components/Pill";
import { type OrderDetailsFragment, OrderStatus } from "@dashboard/graphql";
import { transformOrderStatus } from "@dashboard/misc";
import { makeStyles } from "@saleor/macaw-ui";
import { Box, Skeleton } from "@saleor/macaw-ui-next";
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

      <div>
        {order && order.created ? (
          <MerchantDate kind={dateKind} date={order.created} />
        ) : (
          <Skeleton __width="10em" />
        )}
      </div>
    </div>
  );
};

export default Title;
