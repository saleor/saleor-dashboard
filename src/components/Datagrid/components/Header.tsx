import FullScreenIcon from "@dashboard/icons/FullScreenIcon";
import { Box, Button, PlusIcon, sprinkles, Text } from "@saleor/macaw-ui-next";
import React, { FC, PropsWithChildren } from "react";

interface ButtonFullScreenProps {
  isOpen: boolean;
  onToggle: React.MouseEventHandler<HTMLButtonElement>;
}

const ButtonFullScreen: FC<PropsWithChildren<ButtonFullScreenProps>> = ({
  isOpen,
  onToggle,
  children,
}) => {
  return (
    <Button
      data-test-id="button-exit-fullscreen"
      variant="secondary"
      onClick={onToggle}
    >
      <Box
        as="span"
        display="flex"
        __transform={isOpen ? "rotate(180deg)" : undefined}
      >
        <FullScreenIcon
          className={sprinkles({
            fontSize: 4,
          })}
        />
      </Box>
      {children}
    </Button>
  );
};

interface ButtonAddRowProps {
  onAddRow: React.MouseEventHandler<HTMLButtonElement>;
}

const ButtonAddRow: FC<PropsWithChildren<ButtonAddRowProps>> = ({
  onAddRow,
  children,
}) => {
  return (
    <Button
      data-test-id="button-add-variant"
      variant="secondary"
      onClick={onAddRow}
    >
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
      <Text typeSize={5} fontWeight="bold">
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
