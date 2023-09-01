import FullScreenIcon from "@dashboard/icons/FullScreenIcon";
import { Box, Button, PlusIcon, sprinkles } from "@saleor/macaw-ui/next";
import React, { FC, PropsWithChildren } from "react";

import CardTitle from "../../CardTitle";

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
      marginBottom={3}
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
            fontSize: "buttonMedium",
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
      marginBottom={3}
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
    <CardTitle
      title={title}
      toolbar={
        <Box display="flex" __flexDirection="row-reverse" gap={1}>
          {children}
        </Box>
      }
    />
  );
};

Header.ButtonFullScreen = ButtonFullScreen;
Header.ButtonAddRow = ButtonAddRow;

export { Header };
