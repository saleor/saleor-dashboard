// @ts-strict-ignore
import { Typography, TypographyProps } from "@material-ui/core";
import React from "react";

import { useManualTransactionContext } from "../context";

export const ErrorText: React.FC<TypographyProps> = props => {
  const { error } = useManualTransactionContext();

  if (!error) {
    return null;
  }

  return (
    <Typography color="error" variant="body2" {...props}>
      {error}
    </Typography>
  );
};
