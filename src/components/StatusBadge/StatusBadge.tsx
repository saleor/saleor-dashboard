import { NotAllowedIcon, Tooltip, WarningIcon } from "@saleor/macaw-ui";
import React from "react";

export type BadgeVariant = "warning" | "error";

import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  () => ({
    badgeContainer: {
      marginRight: "1rem"
    },
    iconContainer: {
      height: 40,
      width: 40
    }
  }),
  { name: "StatusBadge" }
);

export interface StatusBadgeProps {
  variant: BadgeVariant;
  description: string;
}

const getIcon = (variant: BadgeVariant) => {
  switch (variant) {
    case "warning":
      return <WarningIcon />;
    case "error":
      return <NotAllowedIcon />;
  }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  variant,
  description
}) => {
  const classes = useStyles();

  return (
    <div className={classes.badgeContainer}>
      <Tooltip title={description} variant={variant}>
        <div className={classes.iconContainer}>{getIcon(variant)}</div>
      </Tooltip>
    </div>
  );
};

export default StatusBadge;
