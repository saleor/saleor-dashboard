import { SendFormKeyboardShortcutHint } from "@dashboard/components/SendFormKeyboardShortcutHint/SendFormKeyboardShortcutHint";
import { Box, Button, Textarea } from "@saleor/macaw-ui-next";
import { PropsWithChildren, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

export const Timeline = ({ children }: PropsWithChildren) => {
  return <Box position="relative">{children}</Box>;
};

interface TimelineAddNoteProps {
  disabled?: boolean;
  message: string;
  reset: () => void;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  placeholder?: string;
  buttonLabel?: string | React.ReactNode;
  label?: string;
}

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
  const canSubmit = !disabled && !isMessageEmpty;

  const submit = () => {
    if (canSubmit) {
      reset();
      onSubmit();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  };

  const defaultPlaceholder = intl.formatMessage({
    id: "3evXPj",
    defaultMessage: "Leave your note here...",
  });

  const defaultButtonLabel = (
    <FormattedMessage id="v/1VA6" defaultMessage="Send" description="add order note, button" />
  );

  return (
    <Box marginBottom={6}>
      <Box position="relative">
        <Textarea
          disabled={disabled}
          label={label}
          placeholder={placeholder ?? defaultPlaceholder}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={message}
          name="message"
          width="100%"
          rows={3}
        />
        <Box position="absolute" __bottom="8px" __right="8px">
          <SendFormKeyboardShortcutHint visible={isFocused} />
        </Box>
      </Box>
      <Box display="flex" justifyContent="flex-end" alignItems="center" marginTop={2}>
        <Button disabled={!canSubmit} onClick={submit} variant="secondary" type="button">
          {buttonLabel ?? defaultButtonLabel}
        </Button>
      </Box>
    </Box>
  );
};

Timeline.displayName = "Timeline";
