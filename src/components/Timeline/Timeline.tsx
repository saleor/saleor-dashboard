// @ts-strict-ignore
import { useUser } from "@dashboard/auth";
import { getUserInitials } from "@dashboard/misc";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { Box, Button, vars } from "@saleor/macaw-ui-next";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { DashboardCard } from "../Card";
import { UserAvatar } from "../UserAvatar";

const useStyles = makeStyles(
  theme => ({
    button: {
      padding: `7px`,
    },
    input: {
      "& > div": {
        padding: "14px",
        width: "100%",
      },
      "& textarea": {
        "&::placeholder": {
          opacity: [[1], "!important"] as any,
        },
        width: "100%",
      },
      background: vars.colors.background.default1,
      width: "100%",
    },
    noteRoot: {
      marginBottom: theme.spacing(3),
    },
    noteTitle: {
      "&:last-child": {
        paddingBottom: 0,
        paddingRight: 0,
      },
      paddingLeft: 0,
    },
    root: {
      position: "relative",
    },
  }),
  { name: "Timeline" },
);

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

export const Timeline = (props: TimelineProps) => {
  const { children } = props;
  const classes = useStyles(props);

  return <div className={classes.root}>{children}</div>;
};

export const TimelineAddNote = (props: TimelineAddNoteProps) => {
  const { message, onChange, onSubmit, reset, disabled, placeholder, buttonLabel, label } = props;
  const classes = useStyles(props);
  const { user } = useUser();
  const intl = useIntl();
  const submit = e => {
    reset();
    onSubmit(e);
  };

  return (
    <div className={classes.noteRoot}>
      <DashboardCard.Content paddingX={0}>
        <TextField
          disabled={disabled}
          className={classes.input}
          label={label}
          InputLabelProps={{ shrink: true }}
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
          fullWidth
          multiline
          variant="outlined"
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
      </DashboardCard.Content>
    </div>
  );
};

Timeline.displayName = "Timeline";
export default Timeline;
