import { ReactNode } from "react";
import { Box, Text, convertSizeToScale } from "..";
import { helperTextRecipe } from "./BaseInput.css";

type HelperTextProps = {
  size?: "small" | "medium" | "large";
  error?: boolean;
  children: ReactNode;
};

export const HelperText = ({ size, error, children }: HelperTextProps) => {
  return (
    <Box className={helperTextRecipe({ size })}>
      <Text
        size={convertSizeToScale(size)}
        color={error ? "critical1" : "default2"}
      >
        {children}
      </Text>
    </Box>
  );
};
