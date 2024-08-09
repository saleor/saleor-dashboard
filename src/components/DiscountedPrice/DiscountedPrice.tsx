import { IMoney } from "@dashboard/utils/intl";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";

import Money from "../Money";
import { useStyles } from "./styles";

interface DiscountedPriceProps {
  regularPrice: IMoney;
  discountedPrice: IMoney;
}

const DiscountedPrice: React.FC<DiscountedPriceProps> = ({ regularPrice, discountedPrice }) => {
  const classes = useStyles();

  return (
    <>
      <Text className={classes.strike}>
        <Money money={regularPrice} />
      </Text>
      <Money money={discountedPrice} />
    </>
  );
};

export default DiscountedPrice;
