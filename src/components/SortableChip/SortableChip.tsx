import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import classNames from "classnames";
import React from "react";
import { SortableElement, SortableElementProps } from "react-sortable-hoc";

import SortableHandle from "./SortableHandle";

export interface SortableChipProps extends SortableElementProps {
  className?: string;
  label: React.ReactNode;
  onClose?: () => void;
}

const useStyles = makeStyles(
  theme => ({
    closeIcon: {
      cursor: "pointer",
      fontSize: 16,
      marginLeft: theme.spacing(),
      verticalAlign: "middle"
    },
    content: {
      alignItems: "center",
      display: "flex"
    },
    root: {
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 18,
      display: "inline-block",
      marginRight: theme.spacing(2),
      padding: "6px 12px"
    },
    sortableHandle: {
      marginRight: theme.spacing(1)
    }
  }),
  { name: "SortableChip" }
);

const SortableChip = SortableElement<SortableChipProps>(props => {
  const { className, label, onClose } = props;

  const classes = useStyles(props);

  return (
    <div className={classNames(classes.root, className)}>
      <div className={classes.content}>
        <SortableHandle
          className={classes.sortableHandle}
          data-test="button-drag-handle"
        />
        <Typography data-test="chip-label">{label}</Typography>
        {onClose && (
          <CloseIcon
            className={classes.closeIcon}
            onClick={onClose}
            data-test="button-close"
          />
        )}
      </div>
    </div>
  );
});

SortableChip.displayName = "SortableChip";
export default SortableChip;
