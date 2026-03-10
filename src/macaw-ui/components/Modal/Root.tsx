import { Root as DialogRoot } from "@radix-ui/react-dialog";

export type ModalRootProps = {
  children: React.ReactNode;
  open?: boolean;
  onChange?: (open: boolean) => void;
};

export const Root = ({ children, open, onChange }: ModalRootProps) => {
  return (
    <DialogRoot
      data-macaw-ui-component="Modal"
      open={open}
      onOpenChange={onChange}
    >
      {children}
    </DialogRoot>
  );
};

Root.displayName = "Modal";
