import { Text, TextProps } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

type Props = Omit<TextProps, "children"> & {
  amount: number;
  showSign?: boolean;
};

const tabularNumsStyle: React.CSSProperties = {
  fontVariantNumeric: "tabular-nums",
};

export const OrderSummaryListAmount = ({ amount, showSign = false, ...props }: Props) => {
  const intl = useIntl();

  return (
    <Text fontWeight="medium" style={tabularNumsStyle} {...props}>
      {intl.formatNumber(amount, {
        minimumFractionDigits: 2,
        signDisplay: showSign ? "exceptZero" : "auto",
      })}
    </Text>
  );
};
