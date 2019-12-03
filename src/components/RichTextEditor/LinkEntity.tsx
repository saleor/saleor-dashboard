import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import { ContentState } from "draft-js";
import React from "react";
import { FormattedMessage } from "react-intl";

import { buttonMessages } from "@saleor/intl";
import Link from "../Link";

interface LinkEntityProps {
  children: React.ReactNode;
  contentState: ContentState;
  entityKey: string;
  onEdit: (entityKey: string) => void;
  onRemove: (entityKey: string) => void;
}

const useStyles = makeStyles(
  theme => ({
    anchor: {
      display: "inline-block"
    },
    container: {
      alignItems: "center",
      display: "flex"
    },
    inline: {
      display: "inline-block"
    },
    popover: {
      zIndex: 1
    },
    root: {
      alignItems: "center",
      display: "flex",
      minHeight: 72,
      padding: theme.spacing(1.5, 1.5, 1.5, 3)
    },
    separator: {
      backgroundColor: theme.palette.grey[300],
      display: "inline-block",
      height: 30,
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(),
      width: 1
    }
  }),
  { name: "LinkEntity" }
);

const LinkEntity: React.FC<LinkEntityProps> = props => {
  const { children, contentState, entityKey, onEdit, onRemove } = props;
  const classes = useStyles(props);

  const [isOpened, setOpenStatus] = React.useState(false);
  const anchor = React.useRef<HTMLDivElement>();

  const disable = () => setOpenStatus(false);
  const toggle = () => setOpenStatus(!isOpened);

  return (
    <>
      <div className={classes.anchor} ref={anchor}>
        <Popper
          className={classes.popover}
          open={isOpened}
          anchorEl={anchor.current}
          transition
          disablePortal
          placement="bottom"
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement
              }}
            >
              <Paper className={classes.root}>
                <ClickAwayListener onClickAway={disable} mouseEvent="onClick">
                  <div className={classes.container}>
                    <Typography className={classes.inline} variant="body1">
                      {contentState.getEntity(entityKey).getData().url}
                    </Typography>
                    <span className={classes.separator} />
                    <Button
                      onClick={() => {
                        disable();
                        onEdit(entityKey);
                      }}
                      color="primary"
                    >
                      <FormattedMessage {...buttonMessages.edit} />
                    </Button>
                    <IconButton onClick={() => onRemove(entityKey)}>
                      <DeleteIcon color="primary" />
                    </IconButton>
                  </div>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
      <Link
        href={contentState.getEntity(entityKey).getData().url}
        onClick={toggle}
      >
        {children}
      </Link>
    </>
  );
};
export default LinkEntity;
