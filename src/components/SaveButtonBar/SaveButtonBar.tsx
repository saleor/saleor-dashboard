import Button from "@material-ui/core/Button";
import Portal from "@material-ui/core/Portal";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import classNames from "classnames";
import React from "react";
import { useIntl } from "react-intl";

import useWindowScroll from "@saleor/hooks/useWindowScroll";
import { buttonMessages } from "@saleor/intl";
import { maybe } from "../../misc";
import AppActionContext from "../AppLayout/AppActionContext";
import ConfirmButton, {
  ConfirmButtonTransitionState
} from "../ConfirmButton/ConfirmButton";
import Container from "../Container";

const styles = (theme: Theme) =>
  createStyles({
    button: {
      marginRight: theme.spacing.unit
    },
    cancelButton: {
      marginRight: theme.spacing.unit * 2
    },
    container: {
      display: "flex",
      paddingBottom: theme.spacing.unit * 2,
      paddingTop: theme.spacing.unit * 2,
      [theme.breakpoints.down("sm")]: {
        marginTop: theme.spacing.unit
      }
    },
    deleteButton: {
      "&:hover": {
        backgroundColor: theme.palette.error.dark
      },
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText
    },
    root: {
      background: theme.palette.background.default,
      borderTop: "1px solid transparent",
      boxShadow: `0 -5px 5px 0 ${theme.overrides.MuiCard.root.borderColor}`,
      transition: `box-shadow ${theme.transitions.duration.shortest}ms`
    },
    spacer: {
      flex: "1"
    },
    stop: {
      "&$root": {
        borderTopColor: theme.overrides.MuiCard.root.borderColor,
        boxShadow: `0 0 0 0 ${theme.overrides.MuiCard.root.borderColor}`
      }
    }
  });

interface SaveButtonBarProps extends WithStyles<typeof styles> {
  disabled: boolean;
  state: ConfirmButtonTransitionState;
  labels?: {
    cancel?: string;
    delete?: string;
    save?: string;
  };
  onCancel: () => void;
  onDelete?: () => void;
  onSave(event: any);
}

export const SaveButtonBar = withStyles(styles, { name: "SaveButtonBar" })(
  ({
    classes,
    disabled,
    labels,
    state,
    onCancel,
    onDelete,
    onSave,
    ...props
  }: SaveButtonBarProps) => {
    const intl = useIntl();
    const scrollPosition = useWindowScroll();
    const scrolledToBottom =
      scrollPosition.y + window.innerHeight >= document.body.scrollHeight;

    return (
      <AppActionContext.Consumer>
        {anchor =>
          anchor ? (
            <Portal container={anchor.current}>
              <div
                className={classNames(classes.root, {
                  [classes.stop]: scrolledToBottom
                })}
                {...props}
              >
                <Container className={classes.container}>
                  {!!onDelete && (
                    <Button
                      variant="contained"
                      onClick={onDelete}
                      className={classes.deleteButton}
                    >
                      {labels && labels.delete
                        ? labels.delete
                        : intl.formatMessage(buttonMessages.delete)}
                    </Button>
                  )}
                  <div className={classes.spacer} />
                  <Button
                    className={classes.cancelButton}
                    variant="text"
                    onClick={onCancel}
                  >
                    {maybe(
                      () => labels.cancel,
                      intl.formatMessage(buttonMessages.cancel)
                    )}
                  </Button>
                  <ConfirmButton
                    disabled={disabled}
                    onClick={onSave}
                    transitionState={state}
                  >
                    {maybe(
                      () => labels.save,
                      intl.formatMessage(buttonMessages.save)
                    )}
                  </ConfirmButton>
                </Container>
              </div>
            </Portal>
          ) : null
        }
      </AppActionContext.Consumer>
    );
  }
);
SaveButtonBar.displayName = "SaveButtonBar";
export default SaveButtonBar;
