import { Text, TextProps } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

type Props = Omit<TextProps, "children"> & { amount: number };

export const OrderSumaryListAmount = ({ amount, ...props }: Props) => {
  const intl = useIntl();

  return (
    <Text fontFamily="Geist Mono" fontWeight="medium" {...props}>
      {intl.formatNumber(amount, {
        minimumFractionDigits: 2,
      })}
    </Text>
  );
};
