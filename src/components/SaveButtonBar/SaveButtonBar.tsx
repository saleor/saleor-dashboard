import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Portal from "@material-ui/core/Portal";
import { makeStyles } from "@material-ui/core/styles";
import useWindowScroll from "@saleor/hooks/useWindowScroll";
import { buttonMessages } from "@saleor/intl";
import React from "react";
import { useIntl } from "react-intl";

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
    content: {
      "&:last-child": {
        paddingBottom: theme.spacing(2)
      },
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
      height: 120
    },
    spacer: {
      flex: "1"
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
    scrollPosition.y + window.innerHeight - document.body.scrollHeight >= -5;

  return (
    <AppActionContext.Consumer>
      {anchor =>
        anchor ? (
          <Portal container={anchor.current}>
            <div className={classes.root} {...rest}>
              <Container>
                <Card elevation={scrolledToBottom ? 0 : 16}>
                  <CardContent className={classes.content}>
                    {!!onDelete && (
                      <Button
                        variant="contained"
                        onClick={onDelete}
                        className={classes.deleteButton}
                        data-test="button-bar-delete"
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
                      data-test="button-bar-cancel"
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
                      data-test="button-bar-confirm"
                    >
                      {maybe(
                        () => labels.save,
                        intl.formatMessage(buttonMessages.save)
                      )}
                    </ConfirmButton>
                  </CardContent>
                </Card>
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
