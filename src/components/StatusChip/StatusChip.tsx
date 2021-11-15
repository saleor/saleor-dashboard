import { Typography } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";

import { Size } from "../ActionDialog/types";
import { StatusType } from "./types";

export interface StatusChipProps {
  status?: StatusType;
  size?: Size;
  label?: string;
}

export const statusChipStyles = {
  alert: {
    background: "#FFF4E4"
  },
  alertLabel: {
    color: "#FFB84E"
  },
  error: {
    backgroundColor: "rgba(254, 110, 118, 0.15)"
  },
  errorLabel: {
    color: "#FE6E76"
  },
  neutral: {
    background: "rgba(40, 35, 74, 0.1)"
  },
  neutralLabel: {
    color: "#28234A"
  },
  success: {
    background: "rgba(93, 194, 146, 0.3)"
  },
  successLabel: {
    color: "#5DC292"
  },
  lg: {
    padding: "4px 16px"
  },
  lgLabel: {
    fontSize: "1.5rem"
  },
  md: {
    padding: "4px 16px"
  },
  mdLabel: {
    fontSize: 16
  }
};

const useStyles = makeStyles(
  theme => ({
    label: {
      fontWeight: theme.typography.fontWeightBold,
      textTransform: "uppercase"
    },
    root: {
      borderRadius: 22,
      display: "inline-block"
    },
    ...statusChipStyles
  }),
  { name: "StatusChip" }
);

const StatusChip: React.FC<StatusChipProps> = props => {
  const { status = StatusType.NEUTRAL, size = "lg", label } = props;
  const classes = useStyles(props);

  if (!label) {
    return null;
  }

  return (
    <div className={classNames(classes.root, classes[status], classes[size])}>
      <Typography
        className={classNames(
          classes.label,
          classes[`${status}Label`],
          classes[`${size}Label`]
        )}
      >
        {label}
      </Typography>
    </div>
  );
};

export default StatusChip;
