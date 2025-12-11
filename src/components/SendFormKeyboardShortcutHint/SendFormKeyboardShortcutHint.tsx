import { Box, Text, vars } from "@saleor/macaw-ui-next";
import { CSSProperties, ReactElement, ReactNode } from "react";
import { FormattedMessage } from "react-intl";

const isMac = window.navigator.platform?.toLowerCase().includes("mac");

const kbdStyle: CSSProperties = {
  display: "inline-block",
  padding: "2px 5px",
  fontSize: "10px",
  fontFamily: "inherit",
  backgroundColor: vars.colors.background.default2,
  borderRadius: "3px",
  border: `1px solid ${vars.colors.border.default1}`,
};

const getModifierKey = (): string => (isMac ? "⌘" : "Ctrl");

interface KeyboardKeyProps {
  children: ReactNode;
}

export const KeyboardKey = ({ children }: KeyboardKeyProps): ReactElement => (
  <kbd style={kbdStyle}>{children}</kbd>
);

interface SendFormKeyboardShortcutHintProps {
  visible?: boolean;
  key1: string;
  key2: string;
}

/**
 * Displays a keyboard shortcut hint for sending forms (e.g., "Press ⌘ ↵ to send").
 */
export const SendFormKeyboardShortcutHint = ({
  visible = true,
  key1,
  key2,
}: SendFormKeyboardShortcutHintProps): ReactElement => (
  <Box
    display="flex"
    alignItems="center"
    gap={1}
    style={{
      opacity: visible ? 1 : 0,
      transition: "opacity 0.15s ease-in-out",
      pointerEvents: visible ? "auto" : "none",
    }}
  >
    <Text size={1} color="default2">
      <FormattedMessage
        id="ILrXJV"
        defaultMessage="Press {key1} {key2} to send"
        values={{
          key1: <KeyboardKey>{key1}</KeyboardKey>,
          key2: <KeyboardKey>{key2}</KeyboardKey>,
        }}
      />
    </Text>
  </Box>
);

/**
 * Returns the correct modifier key symbol for the platform (⌘ for Mac, Ctrl for others).
 */
export { getModifierKey };
