import { Typography } from "@material-ui/core";
import { alpha } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@saleor/macaw-ui";
import clsx from "clsx";
import React from "react";

export interface ChipProps {
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
      verticalAlign: "middle",
    },
    label: {
      color: theme.palette.common.white,
    },
    root: {
      background: alpha(theme.palette.primary.main, 0.8),
      borderRadius: 18,
      display: "inline-block",
      marginRight: theme.spacing(2),
      padding: "6px 12px",
    },
  }),
  { name: "Chip" },
);
const Chip: React.FC<ChipProps> = props => {
  const { className, label, onClose } = props;
  const classes = useStyles(props);

  return (
    <div className={clsx(classes.root, className)}>
      <Typography className={classes.label} variant="caption">
        {label}
        {onClose && <CloseIcon className={classes.closeIcon} onClick={onClose} />}
      </Typography>
    </div>
  );
};
Chip.displayName = "Chip";
export default Chip;
