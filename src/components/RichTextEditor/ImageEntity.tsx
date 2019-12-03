import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import { ContentState } from "draft-js";
import React from "react";
import { FormattedMessage } from "react-intl";

interface ImageEntityProps {
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
    image: { maxWidth: "100%" },
    inline: {
      display: "inline-block"
    },
    root: {
      alignItems: "center",
      display: "flex",
      minHeight: 72,
      padding: theme.spacing(1.5)
    }
  }),
  { name: "ImageEntity" }
);

const ImageEntity: React.FC<ImageEntityProps> = props => {
  const { contentState, entityKey, onEdit, onRemove } = props;
  const classes = useStyles(props);

  const [isOpened, setOpenStatus] = React.useState(false);
  const anchor = React.useRef<HTMLDivElement>();

  const disable = () => setOpenStatus(false);
  const toggle = () => setOpenStatus(!isOpened);

  return (
    <>
      <div className={classes.anchor} ref={anchor}>
        <Popper
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
                    <Button
                      onClick={() => {
                        disable();
                        onEdit(entityKey);
                      }}
                      color="primary"
                    >
                      <FormattedMessage
                        defaultMessage="Replace"
                        description="replace image, button"
                      />
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
      <img
        className={classes.image}
        src={contentState.getEntity(entityKey).getData().href}
        onClick={toggle}
      />
    </>
  );
};
export default ImageEntity;
