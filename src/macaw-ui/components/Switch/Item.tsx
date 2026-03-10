import * as Switch from "@radix-ui/react-radio-group";
import { ReactNode } from "react";

import { DataAttributes } from "../types";
import { Box, PropsWithBox } from "../Box";
import { switchChild } from "./Switch.css";

export type SwitchItemProps = PropsWithBox<{
  value: string;
  id: string;
  children: ReactNode;
  disabled?: boolean;
}> &
  DataAttributes;

export const SwitchItem = ({
  value,
  id,
  disabled = false,
  children,
  ...rest
}: SwitchItemProps) => {
  return (
    <Switch.Item
      asChild
      value={value}
      id={id}
      disabled={disabled}
      className={switchChild()}
      data-macaw-ui-component="SwitchItem"
    >
      <Box {...rest}>{children}</Box>
    </Switch.Item>
  );
};

SwitchItem.displayName = "Switch.Item";
