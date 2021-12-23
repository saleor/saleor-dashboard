import DiscountedPrice from "@saleor/components/DiscountedPrice/DiscountedPrice";
import Money from "@saleor/components/Money";
import { SearchOrderVariant_search_edges_node_variants_pricing } from "@saleor/orders/types/SearchOrderVariant";
import * as React from "react";

import { useStyles } from "./styles";

interface OrderPriceLabelProps {
  pricing: SearchOrderVariant_search_edges_node_variants_pricing;
}

const OrderPriceLabel: React.FC<OrderPriceLabelProps> = ({ pricing }) => {
  const classes = useStyles();

  if (pricing.onSale) {
    const { price, priceUndiscounted } = pricing;
    return (
      <div className={classes.percentDiscountLabelContainer}>
        <DiscountedPrice
          discountedPrice={price.gross}
          regularPrice={priceUndiscounted.gross}
        />
      </div>
    );
  }

  return <Money money={pricing.priceUndiscounted.gross} align="right" />;
};

export default OrderPriceLabel;
