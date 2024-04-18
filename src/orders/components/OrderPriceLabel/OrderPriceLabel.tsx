// @ts-strict-ignore
import DiscountedPrice from "@dashboard/components/DiscountedPrice/DiscountedPrice";
import Money from "@dashboard/components/Money";
import { SearchOrderVariantQuery } from "@dashboard/graphql";
import { Typography } from "@material-ui/core";
import * as React from "react";

import { useStyles } from "./styles";

interface OrderPriceLabelProps {
  pricing: SearchOrderVariantQuery["search"]["edges"][0]["node"]["variants"][0]["pricing"];
}

const OrderPriceLabel: React.FC<OrderPriceLabelProps> = ({ pricing }) => {
  const classes = useStyles();

  if (pricing.onSale) {
    const { price, priceUndiscounted } = pricing;
    return (
      <div className={classes.percentDiscountLabelContainer}>
        <DiscountedPrice discountedPrice={price.gross} regularPrice={priceUndiscounted.gross} />
      </div>
    );
  }

  return (
    <Typography align="right">
      <Money money={pricing.priceUndiscounted.gross} />
    </Typography>
  );
};

export default OrderPriceLabel;
