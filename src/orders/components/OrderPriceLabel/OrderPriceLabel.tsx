import { Typography } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import Money from "@saleor/components/Money";
import * as React from "react";
import { SearchOrderVariant_search_edges_node_variants_pricing } from "@saleor/orders/types/SearchOrderVariant";

interface OrderPriceLabelProps {
  pricing: SearchOrderVariant_search_edges_node_variants_pricing;
}

const useStyles = makeStyles(theme => ({
  percentDiscountLabelContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "flex-end"
  },
  strike: {
    textDecoration: "line-through",
    color: theme.palette.grey[400],
    fontSize: "smaller"
  }
}));

const OrderPriceLabel: React.FC<OrderPriceLabelProps> = ({ pricing }) => {
  const classes = useStyles();

  if (!!pricing.onSale) {
    const { price, priceUndiscounted } = pricing;
    return (
      <div className={classes.percentDiscountLabelContainer}>
        <Typography className={classes.strike}>
          <Money money={priceUndiscounted.gross} />
        </Typography>
        <Money money={price.gross} />
      </div>
    );
  }

  return <Money money={pricing.priceUndiscounted.gross} />;
};

export default OrderPriceLabel;
