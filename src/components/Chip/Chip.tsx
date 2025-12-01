import { alpha } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@saleor/macaw-ui";
import { Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import * as React from "react";

interface ChipProps {
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
const Chip = (props: ChipProps) => {
  const { className, label, onClose } = props;
  const classes = useStyles(props);

  return (
    <div className={clsx(classes.root, className)}>
      <Text className={classes.label} size={2} fontWeight="medium">
        {label}
        {onClose && <CloseIcon className={classes.closeIcon} onClick={onClose} />}
      </Text>
    </div>
  );
};

Chip.displayName = "Chip";
export default Chip;
