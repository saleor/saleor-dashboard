// @ts-strict-ignore
import { useUser } from "@dashboard/auth";
import { Button } from "@dashboard/components/Button";
import { getUserInitials } from "@dashboard/misc";
import { CardContent, TextField } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { vars } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { UserAvatar } from "../UserAvatar";

const useStyles = makeStyles(
  theme => ({
    avatar: {
      left: -19,
      position: "absolute",
      top: 20,
    },
    button: {
      padding: `7px`,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    },
    cardActionsExpanded: {
      maxHeight: theme.spacing(6),
    },
    input: {
      "& > div": {
        padding: "0 0 0 14px",
      },
      "& textarea": {
        "&::placeholder": {
          opacity: [[1], "!important"] as any,
        },
      },
      background: vars.colors.background.default1,
    },
    noteRoot: {
      marginBottom: theme.spacing(3),
      // position: "absolute",
      top: 0,
      left: -19,
      right: 0,
    },
    noteTitle: {
      "&:last-child": {
        paddingBottom: 0,
        paddingRight: 0,
      },
      paddingLeft: 0,
    },
    root: {
      marginLeft: 20,
      paddingLeft: 21,
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
}

export const Timeline: React.FC<TimelineProps> = props => {
  const { children } = props;
  const classes = useStyles(props);

  return <div className={classes.root}>{children}</div>;
};

export const TimelineAddNote: React.FC<TimelineAddNoteProps> = props => {
  const { message, onChange, onSubmit, reset, disabled } = props;
  const classes = useStyles(props);
  const { user } = useUser();
  const intl = useIntl();
  const submit = e => {
    reset();
    onSubmit(e);
  };

  return (
    <div className={classes.noteRoot}>
      <CardContent className={classes.noteTitle}>
        <UserAvatar
          url={user?.avatar?.url}
          initials={getUserInitials(user)}
          className={classes.avatar}
        />
        <TextField
          disabled={disabled}
          className={classes.input}
          placeholder={intl.formatMessage({
            id: "3evXPj",
            defaultMessage: "Leave your note here...",
          })}
          onChange={onChange}
          value={message}
          name="message"
          fullWidth
          multiline
          InputProps={{
            endAdornment: (
              <Button className={classes.button} disabled={disabled} onClick={e => submit(e)}>
                <FormattedMessage
                  id="v/1VA6"
                  defaultMessage="Send"
                  description="add order note, button"
                />
              </Button>
            ),
          }}
          variant="outlined"
        />
      </CardContent>
    </div>
  );
};

Timeline.displayName = "Timeline";
export default Timeline;
