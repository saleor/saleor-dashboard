import { forwardRef } from "react";
import { TextProps, Text } from "../Text";

export const Paragraph = forwardRef<HTMLSpanElement, TextProps>(
  ({ ...rest }, ref) => {
    return (
      <Text
        ref={ref}
        display="block"
        as="p"
        data-macaw-ui-component="Paragraph"
        {...rest}
      />
    );
  }
);

Paragraph.displayName = "Paragraph";
