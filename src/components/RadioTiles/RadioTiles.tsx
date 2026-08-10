import * as RadixRadioGroup from "@radix-ui/react-radio-group";
import type * as React from "react";

import { RadioTile } from "./RadioTile";

interface RadioTilesProps {
  children: React.ReactNode;
  asChild?: boolean;
  value: string;
  onValueChange: (value: string) => void;
  /** Groups Radix form bubble inputs; required when rendered inside a `<form>`. */
  name?: string;
}

const RadioTilesBase = ({
  children,
  asChild = false,
  value,
  onValueChange,
  name,
}: RadioTilesProps) => {
  return (
    <RadixRadioGroup.Root asChild={asChild} value={value} onValueChange={onValueChange} name={name}>
      {children}
    </RadixRadioGroup.Root>
  );
};

export const RadioTiles = Object.assign(RadioTilesBase, { RadioTile });
