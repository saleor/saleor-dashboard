import { Root as DialogRoot } from "@radix-ui/react-dialog";

export type DrawerRootProps = {
  children: React.ReactNode;
};

export const Root = ({ children }: DrawerRootProps) => {
  return <DialogRoot data-macaw-ui-component="Drawer">{children}</DialogRoot>;
};

Root.displayName = "Drawer";
