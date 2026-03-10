import * as Dialog from "@radix-ui/react-dialog";
import { sprinkles } from "~/theme";
import { Box, PropsWithBox } from "../Box";
import { Button } from "../Button";
import { CloseIcon } from "../Icons";
import { DataAttributes } from "../types";

import { Backdrop } from "../Backdrop";
import { showContent } from "./Content.css";

export type DrawerContentProps = PropsWithBox<
  DataAttributes & {
    children: React.ReactNode;
  }
>;

export const Content = ({ children, ...rest }: DrawerContentProps) => {
  return (
    <Dialog.Portal>
      <Dialog.Overlay asChild className={showContent}>
        <Backdrop />
      </Dialog.Overlay>
      <Dialog.Content asChild className={showContent}>
        <Box
          backgroundColor="default1"
          boxShadow="defaultModal"
          top={0}
          left={0}
          height="100%"
          borderTopRightRadius={3}
          borderBottomRightRadius={3}
          position="fixed"
          paddingTop={7}
          data-macaw-ui-component="Drawer.Content"
          {...rest}
        >
          {children}
          <Dialog.Close asChild>
            <Button
              variant="tertiary"
              icon={<CloseIcon />}
              size="small"
              className={sprinkles({
                position: "absolute",
                top: 1,
                right: 1,
              })}
            />
          </Dialog.Close>
        </Box>
      </Dialog.Content>
    </Dialog.Portal>
  );
};

Content.displayName = "Drawer.Content";
