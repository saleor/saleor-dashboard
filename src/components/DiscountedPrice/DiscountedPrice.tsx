import { Typography } from "@material-ui/core";
import React from "react";

import Money, { IMoney } from "../Money";
import { useStyles } from "./styles";

interface DiscountedPriceProps {
  regularPrice: IMoney;
  discountedPrice: IMoney;
}

const DiscountedPrice: React.FC<DiscountedPriceProps> = ({
  regularPrice,
  discountedPrice,
}) => {
  const classes = useStyles();

  return (
    <>
      <Typography className={classes.strike}>
        <Money money={regularPrice} />
      </Typography>
      <Money money={discountedPrice} />
    </>
  );
};

export default DiscountedPrice;
