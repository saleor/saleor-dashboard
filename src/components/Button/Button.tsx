import { isExternalURL } from "@dashboard/utils/urls";
import { type OverridableComponent } from "@material-ui/core/OverridableComponent";
import { Button as MacawButton, type ButtonTypeMap } from "@saleor/macaw-ui";
import { forwardRef } from "react";
import { Link } from "react-router-dom";

const _Button = forwardRef<HTMLButtonElement, any>(({ href, ...props }, ref) => {
  if (href && !isExternalURL(href)) {
    // @ts-expect-error legacy macaw types
    return <MacawButton {...props} to={href} component={Link} ref={ref} />;
  }

  return <MacawButton href={href} {...props} ref={ref} />;
});

_Button.displayName = "Button";

export const Button = _Button as OverridableComponent<ButtonTypeMap>;
