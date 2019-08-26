import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CardContent from "@material-ui/core/CardContent";
import deepPurple from "@material-ui/core/colors/deepPurple";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import PersonIcon from "@material-ui/icons/Person";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const styles = (theme: Theme) =>
  createStyles({
    avatar: {
      "& span": {
        height: "100%",
        width: "100%"
      },
      alignSelf: "flex-start",
      marginRight: theme.spacing.unit * 5.5
    },
    cardActionsExpanded: {
      maxHeight: theme.spacing.unit * 6
    },
    input: {
      marginTop: -theme.spacing.unit
    },
    noteRoot: {
      left: -theme.spacing.unit * 8.5 - 1,
      marginBottom: theme.spacing.unit * 3,
      position: "relative",
      width: `calc(100% + ${theme.spacing.unit * 8.5}px)`
    },
    noteTitle: {
      "&:last-child": {
        paddingBottom: 0
      },
      alignItems: "center",
      background: theme.palette.background.default,
      display: "flex"
    },
    root: {
      borderColor: theme.overrides.MuiCard.root.borderColor,
      borderStyle: "solid",
      borderWidth: "0 0 0 2px",
      marginLeft: 20,
      paddingLeft: theme.spacing.unit * 3
    }
  });

interface TimelineProps extends WithStyles<typeof styles> {
  children?: React.ReactNode;
}

interface TimelineAddNoteProps extends WithStyles<typeof styles> {
  message: string;
  onChange(event: React.ChangeEvent<any>);
  onSubmit(event: React.FormEvent<any>);
}

export const Timeline = withStyles(styles, { name: "Timeline" })(
  ({ classes, children }: TimelineProps) => (
    <div className={classes.root}>{children}</div>
  )
);

export const TimelineAddNote = withStyles(styles, { name: "TimelineAddNote" })(
  ({ classes, message, onChange, onSubmit }: TimelineAddNoteProps) => {
    const intl = useIntl();

    return (
      <div className={classes.noteRoot}>
        <CardContent className={classes.noteTitle}>
          <Avatar
            style={{ background: deepPurple[500] }}
            className={classes.avatar}
          >
            <PersonIcon />
          </Avatar>
          <TextField
            className={classes.input}
            placeholder={intl.formatMessage({
              defaultMessage: "Leave your note here..."
            })}
            onChange={onChange}
            value={message}
            name="message"
            fullWidth
            multiline
            InputProps={{
              endAdornment: (
                <Button color="primary" onClick={onSubmit}>
                  <FormattedMessage
                    defaultMessage="Send"
                    description="add order note, button"
                  />
                </Button>
              )
            }}
            variant="standard"
          />
        </CardContent>
      </div>
    );
  }
);
Timeline.displayName = "Timeline";
export default Timeline;
