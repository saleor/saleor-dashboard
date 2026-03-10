import { Trigger as RadixPopoverTrigger } from "@radix-ui/react-popover";

export interface PopoverTriggerProps {
  children: React.ReactNode;
}

export const Trigger = ({ children }: PopoverTriggerProps) => {
  return (
    <RadixPopoverTrigger asChild data-macaw-ui-component="Popover.Trigger">
      {children}
    </RadixPopoverTrigger>
  );
};

Trigger.displayName = "Popover.Trigger";
