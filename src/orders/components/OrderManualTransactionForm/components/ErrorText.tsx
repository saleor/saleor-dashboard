// @ts-strict-ignore
import { Text, type TextProps } from "@saleor/macaw-ui-next";

import { useManualTransactionContext } from "../context";

export const ErrorText = (props: Omit<TextProps, "children">) => {
  const { error } = useManualTransactionContext();

  if (!error) {
    return null;
  }

  return (
    <Text color="critical1" fontSize={3} {...props}>
      {error}
    </Text>
  );
};
