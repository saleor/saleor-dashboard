import { createBox } from "@dessert-box/react";
import { ComponentProps } from "react";

import { sprinkles } from "~/theme";

export type BoxProps = ComponentProps<typeof Box>;

export const Box = createBox({ atoms: sprinkles });

export type PropsWithBox<T> = Omit<
  ComponentProps<typeof Box>,
  // omit size and ref as they are defined on components
  keyof T | "size" | "ref"
> &
  T;
