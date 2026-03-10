import { Root as RadixPopoverRoot } from "@radix-ui/react-popover";

export type PopoverProps = {
  className?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  modal?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const PopoverRoot = ({ children, ...props }: PopoverProps) => {
  return (
    <RadixPopoverRoot {...props} data-macaw-ui-component="Popover">
      {children}
    </RadixPopoverRoot>
  );
};

PopoverRoot.displayName = "Popover";
