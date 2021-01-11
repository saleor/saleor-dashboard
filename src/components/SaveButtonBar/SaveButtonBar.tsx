import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Portal from "@material-ui/core/Portal";
import { makeStyles } from "@material-ui/core/styles";
import useWindowScroll from "@saleor/hooks/useWindowScroll";
import { buttonMessages } from "@saleor/intl";
import React from "react";
import { useIntl } from "react-intl";

import { useAppAction } from "../AppLayout/AppActionContext";
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
    paper: {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0
    },
    root: {
      height: 70
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

  const appAction = useAppAction();
  const intl = useIntl();
  const scrollPosition = useWindowScroll();

  React.useEffect(() => {
    if (!disabled && state !== "loading") {
      appAction.setDocked(false);
    }
  }, [disabled]);
  React.useEffect(() => () => appAction.setDocked(true), []);

  const scrolledToBottom =
    scrollPosition.y + window.innerHeight >= document.body.scrollHeight;

  return appAction.anchor ? (
    <Portal container={appAction.anchor.current}>
      <div className={classes.root} {...rest}>
        <Container>
          <Card
            className={classes.paper}
            elevation={!(appAction.docked || scrolledToBottom) ? 16 : 0}
          >
            <CardContent className={classes.content}>
              {!!onDelete && (
                <Button
                  variant="contained"
                  onClick={onDelete}
                  className={classes.deleteButton}
                  data-test="button-bar-delete"
                >
                  {labels?.delete || intl.formatMessage(buttonMessages.delete)}
                </Button>
              )}
              <div className={classes.spacer} />
              <Button
                className={classes.cancelButton}
                variant="text"
                onClick={onCancel}
                data-test="button-bar-cancel"
              >
                {labels?.cancel || intl.formatMessage(buttonMessages.back)}
              </Button>
              <ConfirmButton
                disabled={disabled}
                onClick={onSave}
                transitionState={state}
                data-test="button-bar-confirm"
                onTransitionToDefault={() => appAction.setDocked(true)}
              >
                {labels?.save || intl.formatMessage(buttonMessages.save)}
              </ConfirmButton>
            </CardContent>
          </Card>
        </Container>
      </div>
    </Portal>
  ) : null;
};
SaveButtonBar.displayName = "SaveButtonBar";
export default SaveButtonBar;
