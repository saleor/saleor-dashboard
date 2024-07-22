// @ts-strict-ignore
import { Text, TextProps } from "@saleor/macaw-ui-next";
import React from "react";

import { useManualTransactionContext } from "../context";

export const ErrorText: React.FC<TextProps> = props => {
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
