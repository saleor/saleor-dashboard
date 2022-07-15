import { Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@saleor/macaw-ui";
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
    closeButton: {
      marginLeft: theme.spacing(),
      background: "none",
      border: "none",
    },
    closeIcon: {
      cursor: "pointer",
      fontSize: 16,
      verticalAlign: "middle",
    },
    content: {
      alignItems: "center",
      display: "flex",
    },
    root: {
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 18,
      display: "inline-block",
      marginRight: theme.spacing(2),
      padding: "6px 12px",
    },
    sortableHandle: {
      marginRight: theme.spacing(1),
    },
  }),
  { name: "SortableChip" },
);

const SortableChip = SortableElement((props: SortableChipProps) => {
  const { className, label, onClose } = props;

  const classes = useStyles(props);

  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className={classNames(classes.root, className)}>
      <div className={classes.content}>
        <SortableHandle
          className={classes.sortableHandle}
          data-test-id="button-drag-handle"
        />
        <Typography data-test-id="chip-label">{label}</Typography>
        {onClose && (
          <button
            className={classes.closeButton}
            onClick={handleClose}
            data-test-id="button-close"
          >
            <CloseIcon className={classes.closeIcon} />
          </button>
        )}
      </div>
    </div>
  );
});

SortableChip.displayName = "SortableChip";
export default SortableChip;
