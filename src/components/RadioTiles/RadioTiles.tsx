import * as RadixRadioGroup from "@radix-ui/react-radio-group";
import React from "react";

import { RadioTile } from "./RadioTile";

export interface RadioTilesProps {
  children: React.ReactNode;
  asChild: boolean;
  value: string;
  onValueChange: (value: string) => void;
}

const RadioTilesBase = ({ children, asChild, value, onValueChange }: RadioTilesProps) => {
  return (
    <RadixRadioGroup.Root asChild={asChild} value={value} onValueChange={onValueChange}>
      {children}
    </RadixRadioGroup.Root>
  );
};

export const RadioTiles = Object.assign(RadioTilesBase, { RadioTile });
