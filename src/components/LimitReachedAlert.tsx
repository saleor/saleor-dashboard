import { Alert, type AlertProps } from "@saleor/macaw-ui";
import { sprinkles } from "@macaw-ui";
import clsx from "clsx";

type LimitReachedAlertProps = Omit<AlertProps, "variant" | "close">;

const LimitReachedAlert = (props: LimitReachedAlertProps) => (
  // TODO: migrate to new macaw-ui alert
  <Alert
    variant="warning"
    close
    className={clsx(
      sprinkles({
        gridColumn: "8",
        marginBottom: 2,
      }),
      "remove-icon-background",
    )}
    {...props}
  />
);

LimitReachedAlert.displayName = "LimitReachedAlert";
export default LimitReachedAlert;
