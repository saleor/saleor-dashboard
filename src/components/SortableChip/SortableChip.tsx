import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@saleor/macaw-ui";
import { Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import * as React from "react";
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
    <div
      className={clsx(classes.root, className, {
        [classes.disabled]: loading,
      })}
    >
      <div className={classes.content}>
        <SortableHandle
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          className={clsx(classes.sortableHandle, {
            [classes.disabled]: loading,
          })}
          data-test-id="button-drag-handle"
        />
        <Text data-test-id="chip-label">{label}</Text>
        {onClose && (
          <button
            className={clsx(classes.closeButton, {
              [classes.disabled]: loading,
            })}
            onClick={handleClose}
            data-test-id="button-close"
            disabled={loading}
          >
            <CloseIcon
              className={clsx(classes.closeIcon, {
                [classes.disabled]: loading,
              })}
            />
          </button>
        )}
      </div>
    </div>
  );
});

SortableChip.displayName = "SortableChip";
export default SortableChip;
