import { ReactNode } from "react";
import { Trigger as DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";

export type DropdownTriggerProps = {
  children: ReactNode;
};

export const Trigger = ({ children }: DropdownTriggerProps) => {
  return (
    <DropdownMenuTrigger asChild data-macaw-ui-component="Dropdown.Trigger">
      {children}
    </DropdownMenuTrigger>
  );
};

Trigger.displayName = "Dropdown.Trigger";
