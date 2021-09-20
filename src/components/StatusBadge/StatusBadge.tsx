import errorIcon from "@assets/images/error.svg";
import warningIcon from "@assets/images/warning.svg";
import { Tooltip } from "@saleor/macaw-ui";
import React from "react";
import SVG from "react-inlinesvg";

export type BadgeVariant = "warning" | "error";

export interface StatusBadgeProps {
  variant: BadgeVariant;
  description: string;
}

const getIcon = (variant: BadgeVariant) => {
  switch (variant) {
    case "warning":
      return warningIcon;
    case "error":
      return errorIcon;
  }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  variant,
  description
}) => (
  <div style={{ marginRight: "1rem" }}>
    <Tooltip title={description} variant={variant}>
      <div style={{ height: 40, width: 40 }}>
        <SVG src={getIcon(variant)} width="100%" height="100%" />
      </div>
    </Tooltip>
  </div>
);

export default StatusBadge;
