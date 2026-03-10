import { ModalContextProvider } from "@dashboard/components/Modal/context";
import { Modal, type ModalRootProps } from "@macaw-ui";

type RootProps = ModalRootProps;

export const Root = ({ children, onChange, open, ...rest }: RootProps) => {
  return (
    <ModalContextProvider onChange={onChange} open={open}>
      <Modal onChange={onChange} open={open} {...rest}>
        {children}
      </Modal>
    </ModalContextProvider>
  );
};
