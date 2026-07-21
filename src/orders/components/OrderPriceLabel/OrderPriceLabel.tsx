import DiscountedPrice from "@dashboard/components/DiscountedPrice/DiscountedPrice";
import Money from "@dashboard/components/Money";
import { type OrderSearchVariant } from "@dashboard/searches/mapSearchOrderVariantsForAdd";
import { Text } from "@saleor/macaw-ui-next";

import { useStyles } from "./styles";

interface OrderPriceLabelProps {
  pricing: OrderSearchVariant["pricing"];
}

const OrderPriceLabel = ({ pricing }: OrderPriceLabelProps) => {
  const classes = useStyles();

  if (!pricing?.priceUndiscounted) {
    return null;
  }

  if (pricing.onSale && pricing.price) {
    return (
      <div className={classes.percentDiscountLabelContainer}>
        <DiscountedPrice
          discountedPrice={pricing.price.gross}
          regularPrice={pricing.priceUndiscounted.gross}
        />
      </div>
    );
  }

  return (
    <Text>
      <Money money={pricing.priceUndiscounted.gross} />
    </Text>
  );
};

export default OrderPriceLabel;
