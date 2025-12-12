import { Box, Text } from "@saleor/macaw-ui-next";
import { ReactElement, ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import styles from "./SendFormKeyboardShortcutHint.module.css";

const isMac = window.navigator.platform?.toLowerCase().includes("mac");

const getModifierKey = (): string => (isMac ? "⌘" : "Ctrl");

interface KeyboardKeyProps {
  children: ReactNode;
}

export const KeyboardKey = ({ children }: KeyboardKeyProps): ReactElement => (
  <kbd className={styles.kbd}>{children}</kbd>
);

interface SendFormKeyboardShortcutHintProps {
  visible?: boolean;
}

/**
 * Displays a keyboard shortcut hint for sending forms (e.g., "Press ⌘ ↵ to send").
 */
export const SendFormKeyboardShortcutHint = ({
  visible = true,
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
          key1: <KeyboardKey>{getModifierKey()}</KeyboardKey>,
          key2: <KeyboardKey>↵</KeyboardKey>,
        }}
      />
    </Text>
  </Box>
);
