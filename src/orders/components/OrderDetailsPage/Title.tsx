import { makeStyles } from "@material-ui/core/styles";
import StatusChip from "@saleor/components/StatusChip";
import { transformOrderStatus } from "@saleor/misc";
import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";
import React from "react";
import { useIntl } from "react-intl";

export interface TitleProps {
  order?: OrderDetails_order;
}

const useStyles = makeStyles(
  theme => ({
    container: {
      alignItems: "center",
      display: "flex"
    },
    statusContainer: {
      marginLeft: theme.spacing(2)
    }
  }),
  { name: "OrderDetailsTitle" }
);

const Title: React.FC<TitleProps> = props => {
  const intl = useIntl();
  const classes = useStyles(props);
  const { order } = props;

  if (!order) {
    return null;
  }

  const { localized, status } = transformOrderStatus(order.status, intl);

  return (
    <div className={classes.container}>
      {`#${order.number}`}
      <div className={classes.statusContainer}>
        <StatusChip label={localized} type={status} />
      </div>
    </div>
  );
};

export default Title;
