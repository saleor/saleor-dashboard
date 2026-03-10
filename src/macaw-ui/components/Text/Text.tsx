import { forwardRef, ReactNode } from "react";

import { classNames } from "~/utils";

import { Box, PropsWithBox } from "../Box";

import { text, TextVariants } from "./Text.css";

export type TextProps = PropsWithBox<{
  children: ReactNode;
  as?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "p"
    | "span"
    | "a"
    | "strong"
    | "td";
  className?: string;
  size?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
}> &
  TextVariants;

export const Text = forwardRef<HTMLSpanElement, TextProps>(
  (
    {
      children,
      as = "span",
      size = 4,
      ellipsis,
      color = "default1",
      className,
      fontWeight = "regular",
      ...rest
    },
    ref
  ) => (
    <Box
      as={as}
      className={classNames(text({ ellipsis }), className)}
      color={color}
      ref={ref}
      margin={0}
      data-macaw-ui-component="Text"
      fontSize={size}
      letterSpacing={size}
      lineHeight={size}
      fontWeight={fontWeight}
      {...rest}
    >
      {children}
    </Box>
  )
);

Text.displayName = "Text";
