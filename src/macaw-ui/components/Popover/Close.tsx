import { Close as RadixPopoverClose } from "@radix-ui/react-popover";

export const Close = ({ children }: { children: React.ReactNode }) => {
  return (
    <RadixPopoverClose asChild data-macaw-ui-component="Popover.Close">
      {children}
    </RadixPopoverClose>
  );
};

Close.displayName = "Popover.Close";
