import { Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@saleor/macaw-ui";
import clsx from "clsx";
import React from "react";
import { SortableElement, SortableElementProps } from "react-sortable-hoc";

import SortableHandle from "./SortableHandle";

export interface SortableChipProps extends SortableElementProps {
  className?: string;
  label: React.ReactNode;
  onClose?: () => void;
  loading?: boolean;
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
    disabled: {
      cursor: "not-allowed",
    },
  }),
  { name: "SortableChip" },
);

const SortableChip = SortableElement((props: SortableChipProps) => {
  const { className, label, onClose, loading } = props;

  const classes = useStyles(props);

  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className={clsx(classes.root, loading && classes.disabled, className)}>
      <div className={classes.content}>
        <SortableHandle
          className={clsx(classes.sortableHandle, loading && classes.disabled)}
          data-test-id="button-drag-handle"
        />
        <Typography data-test-id="chip-label">{label}</Typography>
        {onClose && (
          <button
            className={clsx(classes.closeButton, loading && classes.disabled)}
            onClick={handleClose}
            data-test-id="button-close"
            disabled={loading}
          >
            <CloseIcon
              className={clsx(classes.closeIcon, loading && classes.disabled)}
            />
          </button>
        )}
      </div>
    </div>
  );
});

SortableChip.displayName = "SortableChip";
export default SortableChip;
