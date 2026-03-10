import { Anchor as RadixPopoverAnchor } from "@radix-ui/react-popover";

export interface PopoverAnchorProps {
  children: React.ReactNode;
}

export const Anchor = ({ children }: PopoverAnchorProps) => {
  return (
    <RadixPopoverAnchor asChild data-macaw-ui-component="Popover.Anchor">
      {children}
    </RadixPopoverAnchor>
  );
};

Anchor.displayName = "Popover.Anchor";
