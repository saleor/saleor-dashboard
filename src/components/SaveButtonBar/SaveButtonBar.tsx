import Button from "@material-ui/core/Button";
import Portal from "@material-ui/core/Portal";
import { makeStyles } from "@material-ui/core/styles";
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

const useStyles = makeStyles(
  theme => ({
    button: {
      marginRight: theme.spacing(1)
    },
    cancelButton: {
      marginRight: theme.spacing(2)
    },
    container: {
      display: "flex",
      paddingBottom: theme.spacing(2),
      paddingTop: theme.spacing(2),
      [theme.breakpoints.down("sm")]: {
        marginTop: theme.spacing(1)
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
      boxShadow: `0 -5px 5px 0 ${theme.palette.divider}`,
      height: 70,
      transition: `box-shadow ${theme.transitions.duration.shortest}ms`
    },
    spacer: {
      flex: "1"
    },
    stop: {
      "&$root": {
        borderTopColor: theme.palette.divider,
        boxShadow: `0 0 0 0 ${theme.palette.divider}`
      }
    }
  }),
  { name: "SaveButtonBar" }
);

interface SaveButtonBarProps {
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

export const SaveButtonBar: React.FC<SaveButtonBarProps> = props => {
  const {
    disabled,
    labels,
    state,
    onCancel,
    onDelete,
    onSave,
    ...rest
  } = props;
  const classes = useStyles(props);

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
              {...rest}
            >
              <Container className={classes.container}>
                {!!onDelete && (
                  <Button
                    variant="contained"
                    onClick={onDelete}
                    className={classes.deleteButton}
                    data-tc="button-bar-delete"
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
                  data-tc="button-bar-cancel"
                >
                  {maybe(
                    () => labels.cancel,
                    intl.formatMessage(buttonMessages.back)
                  )}
                </Button>
                <ConfirmButton
                  disabled={disabled}
                  onClick={onSave}
                  transitionState={state}
                  data-tc="button-bar-confirm"
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
};
SaveButtonBar.displayName = "SaveButtonBar";
export default SaveButtonBar;
