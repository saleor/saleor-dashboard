import {
  Box,
  Button,
  FullscreenOffIcon,
  FullscreenOnIcon,
  PlusIcon,
  Text,
} from "@saleor/macaw-ui-next";
import { FC, PropsWithChildren } from "react";
import * as React from "react";

interface ButtonFullScreenProps {
  isOpen: boolean;
  onToggle: React.MouseEventHandler<HTMLButtonElement>;
}

const ButtonFullScreen = ({
  isOpen,
  onToggle,
  children,
}: PropsWithChildren<ButtonFullScreenProps>) => {
  return (
    <Button data-test-id="button-exit-fullscreen" variant="secondary" onClick={onToggle}>
      <Box as="span" display="flex">
        {isOpen ? <FullscreenOffIcon /> : <FullscreenOnIcon />}
      </Box>
      {children}
    </Button>
  );
};

interface ButtonAddRowProps {
  onAddRow: React.MouseEventHandler<HTMLButtonElement>;
}

const ButtonAddRow = ({ onAddRow, children }: PropsWithChildren<ButtonAddRowProps>) => {
  return (
    <Button data-test-id="button-add-variant" variant="secondary" onClick={onAddRow}>
      <PlusIcon />
      {children}
    </Button>
  );
};

interface HeaderProps {
  title: string;
}

interface GridHeader extends FC<PropsWithChildren<HeaderProps>> {
  ButtonFullScreen: typeof ButtonFullScreen;
  ButtonAddRow: typeof ButtonAddRow;
}

const Header: GridHeader = ({ title, children }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      paddingX={6}
      paddingY={5}
    >
      <Text size={5} fontWeight="bold">
        {title}
      </Text>
      <Box display="flex" __flexDirection="row-reverse" gap={2}>
        {children}
      </Box>
    </Box>
  );
};

Header.ButtonFullScreen = ButtonFullScreen;
Header.ButtonAddRow = ButtonAddRow;

export { Header };
