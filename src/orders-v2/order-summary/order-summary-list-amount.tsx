import { Text, TextProps } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

type Props = Omit<TextProps, "children"> & {
  amount: number;
  showSign?: boolean;
};

export const OrderSummaryListAmount = ({ amount, showSign = false, ...props }: Props) => {
  const intl = useIntl();

  return (
    <Text fontWeight="medium" {...props}>
      {intl.formatNumber(amount, {
        minimumFractionDigits: 2,
        signDisplay: showSign ? "exceptZero" : "auto",
      })}
    </Text>
  );
};
