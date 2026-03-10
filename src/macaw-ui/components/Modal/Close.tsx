import { Close as DialogClose } from "@radix-ui/react-dialog";

export type ModalCloseProps = {
  children: React.ReactNode;
};

export const Close = ({ children }: ModalCloseProps) => {
  return (
    <DialogClose asChild data-macaw-ui-component="Modal.Close">
      {children}
    </DialogClose>
  );
};

Close.displayName = "Modal.Close";
