import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { Maximize, Minimize, PlusIcon } from "lucide-react";
import { type FC, type PropsWithChildren } from "react";

interface ButtonFullScreenProps {
  isOpen: boolean;
  onToggle: React.MouseEventHandler<HTMLButtonElement>;
}

const headerButtonIconProps = {
  size: iconSize.small,
  strokeWidth: iconStrokeWidthBySize.small,
} as const;

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
      icon={
        isOpen ? <Minimize {...headerButtonIconProps} /> : <Maximize {...headerButtonIconProps} />
      }
    >
      {children}
    </Button>
  );
};

interface ButtonAddRowProps {
  onAddRow: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

const ButtonAddRow: FC<PropsWithChildren<ButtonAddRowProps>> = ({
  onAddRow,
  disabled,
  children,
}) => {
  return (
    <Button
      data-test-id="button-add-variant"
      variant="secondary"
      onClick={onAddRow}
      disabled={disabled}
      icon={<PlusIcon {...headerButtonIconProps} />}
    >
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
      <Text size={6} fontWeight="medium">
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
