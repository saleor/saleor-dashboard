// @ts-strict-ignore
import { useUser } from "@dashboard/auth";
import { getUserInitials } from "@dashboard/misc";
import { Box, Button, Textarea } from "@saleor/macaw-ui-next";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { UserAvatar } from "../UserAvatar";

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

export const Timeline: React.FC<TimelineProps> = ({ children }) => {
  return <Box position="relative">{children}</Box>;
};

export const TimelineAddNote: React.FC<TimelineAddNoteProps> = ({
  message,
  onChange,
  onSubmit,
  reset,
  disabled,
  placeholder,
  buttonLabel,
  label,
}) => {
  const { user } = useUser();
  const intl = useIntl();
  const submit = (e: React.FormEvent<any>) => {
    reset();
    onSubmit(e);
  };

  return (
    <Box marginBottom={6}>
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
        value={message}
        name="message"
        width="100%"
        rows={3}
      />
      <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2} marginTop={2}>
        <UserAvatar url={user?.avatar?.url} initials={getUserInitials(user)} />
        <Button disabled={disabled} onClick={e => submit(e)} variant="secondary">
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
export default Timeline;
