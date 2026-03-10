import { Trigger as DialogTrigger } from "@radix-ui/react-dialog";

export type DrawerTriggerProps = {
  children: React.ReactNode;
};

export const Trigger = ({ children }: DrawerTriggerProps) => {
  return (
    <DialogTrigger asChild data-macaw-ui-component="Drawer.Trigger">
      {children}
    </DialogTrigger>
  );
};

Trigger.displayName = "Drawer.Trigger";
