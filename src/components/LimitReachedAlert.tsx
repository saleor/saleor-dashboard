import { Alert, AlertProps } from "@saleor/macaw-ui";
import { sprinkles } from "@saleor/macaw-ui/next";
import React from "react";

export type LimitReachedAlertProps = Omit<AlertProps, "variant" | "close">;

const LimitReachedAlert: React.FC<LimitReachedAlertProps> = props => (
  // TODO: migrate to new macaw-ui alert
  <Alert
    variant="warning"
    close
    className={sprinkles({
      gridColumn: "8",
    })}
    {...props}
  />
);

LimitReachedAlert.displayName = "LimitReachedAlert";
export default LimitReachedAlert;
