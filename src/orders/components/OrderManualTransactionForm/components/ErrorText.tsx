// @ts-strict-ignore
import { Text, type TextProps } from "@macaw-ui";

import { useManualTransactionContext } from "../context";

export const ErrorText = (props: TextProps) => {
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
