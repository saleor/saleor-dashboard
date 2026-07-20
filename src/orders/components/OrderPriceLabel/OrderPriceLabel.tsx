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

  if (!pricing) {
    return null;
  }

  if (pricing.onSale) {
    const { price, priceUndiscounted } = pricing;

    return (
      <div className={classes.percentDiscountLabelContainer}>
        <DiscountedPrice discountedPrice={price.gross} regularPrice={priceUndiscounted.gross} />
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
