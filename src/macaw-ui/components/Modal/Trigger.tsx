import { Trigger as DialogTrigger } from "@radix-ui/react-dialog";

export type ModalTriggerProps = {
  children: React.ReactNode;
};

export const Trigger = ({ children }: ModalTriggerProps) => {
  return (
    <DialogTrigger asChild data-macaw-ui-component="Modal.Trigger">
      {children}
    </DialogTrigger>
  );
};

Trigger.displayName = "Modal.Trigger";
