import { Root as DropdownMenuRoot } from "@radix-ui/react-dropdown-menu";
import { ReactNode } from "react";

export type DropdownRootProps = {
  children: ReactNode;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
};

export const DropdownRoot = ({
  children,
  onOpenChange,
  open,
}: DropdownRootProps) => {
  return (
    <DropdownMenuRoot
      open={open}
      onOpenChange={onOpenChange}
      data-macaw-ui-component="Dropdown"
    >
      {children}
    </DropdownMenuRoot>
  );
};

DropdownRoot.displayName = "Dropdown";
