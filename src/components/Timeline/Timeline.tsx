// @ts-strict-ignore
import { Box, Button, Text, Textarea, vars } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface TimelineProps {
  children?: React.ReactNode;
}

interface TimelineAddNoteProps {
  disabled?: boolean;
  message: string;
  reset: () => void;
  onChange: (event: React.ChangeEvent<any>) => any;
  onSubmit: (event: React.FormEvent<any>) => any;
  placeholder?: string;
  buttonLabel?: string | React.ReactNode;
  label?: string;
}

export const Timeline = ({ children }: TimelineProps) => {
  return <Box position="relative">{children}</Box>;
};

export const TimelineAddNote = ({
  message,
  onChange,
  onSubmit,
  reset,
  disabled,
  placeholder,
  buttonLabel,
  label,
}: TimelineAddNoteProps) => {
  const intl = useIntl();
  const [isFocused, setIsFocused] = useState(false);
  const isMessageEmpty = message.trim().length === 0;
  const isMac = window.navigator.platform?.toLowerCase().includes("mac");

  const submit = (e: React.FormEvent<any>) => {
    reset();
    onSubmit(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && !disabled && !isMessageEmpty) {
      e.preventDefault();
      submit(e);
    }
  };

  const kbdStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "2px 5px",
    fontSize: "10px",
    fontFamily: "inherit",
    backgroundColor: vars.colors.background.default2,
    borderRadius: "3px",
    border: `1px solid ${vars.colors.border.default1}`,
  };

  return (
    <Box marginBottom={6}>
      <Box position="relative">
        <Textarea
          disabled={disabled}
          label={label}
          placeholder={
            placeholder ||
            intl.formatMessage({
              id: "3evXPj",
              defaultMessage: "Leave your note here...",
            })
          }
          onChange={onChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={message}
          name="message"
          width="100%"
          rows={3}
        />
        <Box
          position="absolute"
          __bottom="8px"
          __right="8px"
          display="flex"
          alignItems="center"
          gap={1}
          style={{
            opacity: isFocused ? 1 : 0,
            transition: "opacity 0.15s ease-in-out",
            pointerEvents: isFocused ? "auto" : "none",
          }}
        >
          <Text size={1} color="default2">
            <FormattedMessage
              id="ILrXJV"
              defaultMessage="Press {key1} {key2} to send"
              values={{
                key1: <kbd style={kbdStyle}>{isMac ? "⌘" : "Ctrl"}</kbd>,
                key2: <kbd style={kbdStyle}>↵</kbd>,
              }}
            />
          </Text>
        </Box>
      </Box>
      <Box display="flex" justifyContent="flex-end" alignItems="center" marginTop={2}>
        <Button disabled={disabled || isMessageEmpty} onClick={e => submit(e)} variant="secondary">
          {buttonLabel || (
            <FormattedMessage
              id="v/1VA6"
              defaultMessage="Send"
              description="add order note, button"
            />
          )}
        </Button>
      </Box>
    </Box>
  );
};

Timeline.displayName = "Timeline";
// eslint-disable-next-line import/no-default-export
export default Timeline;
