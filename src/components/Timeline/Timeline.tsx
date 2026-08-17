import { SendFormKeyboardShortcutHint } from "@dashboard/components/SendFormKeyboardShortcutHint/SendFormKeyboardShortcutHint";
import { Box, Button, Textarea } from "@saleor/macaw-ui-next";
import { type PropsWithChildren, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { TimelineStem } from "./TimelineStem";

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
  /** Draw a vertical line from the note input down to the first timeline item. */
  showTimelineConnector?: boolean;
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
  showTimelineConnector = false,
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

  // Macaw Textarea keeps ::placeholder transparent until focus (floating-label pattern).
  // Without a label the field looks empty — fall back so the empty state always has a hint.
  const defaultNoteHint = intl.formatMessage({
    id: "3evXPj",
    defaultMessage: "Leave your note here...",
  });

  const defaultButtonLabel = (
    <FormattedMessage id="v/1VA6" defaultMessage="Send" description="add order note, button" />
  );

  return (
    <Box>
      <Box position="relative">
        <Textarea
          disabled={disabled}
          label={label ?? defaultNoteHint}
          placeholder={placeholder ?? defaultNoteHint}
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
      {/*
        Stem lives here (not inside the textarea wrapper) so it isn't clipped by
        macaw field overflow. Top of this box = note input bottom border.
        paddingBottom replaces the old marginBottom so the stem can paint through it.
      */}
      <Box position="relative" paddingBottom={6} overflow="visible">
        {showTimelineConnector ? (
          <TimelineStem top={0} bottom="-16px" data-test-id="timeline-note-connector" />
        ) : null}
        <Box display="flex" justifyContent="flex-end" alignItems="center" marginTop={2}>
          <Button disabled={!canSubmit} onClick={submit} variant="secondary" type="button">
            {buttonLabel ?? defaultButtonLabel}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

Timeline.displayName = "Timeline";
