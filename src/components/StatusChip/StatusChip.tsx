import { Typography } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";

import { StatusType } from "./types";

export interface StatusChipProps {
  type?: StatusType;
  label?: string;
}

const StatusChipStyles = {
  warning: {
    background: "#FFF4E4"
  },
  warningLabel: {
    color: "#FFB84E"
  },
  error: {
    backgroundColor: "rgba(254, 110, 118, 0.15)"
  },
  errorLabel: {
    color: "#FE6E76"
  },
  info: {
    background: "rgba(40, 35, 74, 0.1)"
  },
  infoLabel: {
    color: "#28234A"
  },
  success: {
    background: "rgba(93, 194, 146, 0.3)"
  },
  successLabel: {
    color: "#5DC292"
  }
};

const useStyles = makeStyles(
  theme => ({
    label: {
      fontSize: theme.typography.body1.fontSize,
      fontWeight: theme.typography.fontWeightBold,
      textTransform: "uppercase"
    },
    root: {
      borderRadius: 22,
      display: "inline-block",
      padding: "8px 24px"
    },
    ...StatusChipStyles
  }),
  { name: "StatusChip" }
);

const StatusChip: React.FC<StatusChipProps> = props => {
  const { type = StatusType.INFO, label } = props;
  const classes = useStyles(props);

  if (!label) {
    return null;
  }

  return (
    <div className={classNames(classes.root, classes[type])}>
      <Typography
        className={classNames(classes.label, classes[`${type}Label`])}
      >
        {label}
      </Typography>
    </div>
  );
};

export default StatusChip;
