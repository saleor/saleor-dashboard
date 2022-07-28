import { OrderDetailsFragment } from "@saleor/graphql";
import { makeStyles, Pill } from "@saleor/macaw-ui";
import { transformOrderStatus } from "@saleor/misc";
import React from "react";
import { useIntl } from "react-intl";

export interface TitleProps {
  order?: OrderDetailsFragment;
}

const useStyles = makeStyles(
  theme => ({
    container: {
      alignItems: "center",
      display: "flex",
    },
    statusContainer: {
      marginLeft: theme.spacing(2),
    },
  }),
  { name: "OrderDetailsTitle" },
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
      {intl.formatMessage(
        { id: "AqXzM2", defaultMessage: "Order #{orderNumber}" },
        { orderNumber: order?.number },
      )}
      <div className={classes.statusContainer}>
        <Pill label={localized} color={status} />
      </div>
    </div>
  );
};

export default Title;
