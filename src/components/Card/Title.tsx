import { Box, Sprinkles, Text } from "@saleor/macaw-ui-next";
import React from "react";

interface TitleProps extends Sprinkles {
  /**
   * @deprecated "title" is deprecated, use "children" instead
   */
  title?: React.ReactNode;
  toolbar?: React.ReactNode;
  className?: string;
}

export const Title: React.FC<TitleProps> = ({
  children,
  title,
  className,
  toolbar,
  color,
  ...rest
}) => {
  const CardTitle = () => (
    <Text
      size={5}
      fontWeight="bold"
      color={color ?? "default1"}
      display="inline-block"
      alignItems="center"
      {...rest}
    >
      {children ?? title}
    </Text>
  );

  const WITH_TOOLBAR_STYLES = {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  } as const;

  return (
    <Box paddingX={6} paddingTop={6} className={className} {...(toolbar && WITH_TOOLBAR_STYLES)}>
      <CardTitle />

      {toolbar}
    </Box>
  );
};
