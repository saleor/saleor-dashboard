import { isExternalURL } from "@dashboard/utils/urls";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import { Button as MacawButton, ButtonTypeMap } from "@saleor/macaw-ui";
import React from "react";
import { Link } from "react-router-dom";

const _Button: React.FC<any> = React.forwardRef(({ href, ...props }, ref) => {
  if (href && !isExternalURL(href)) {
    return <MacawButton {...props} to={href} component={Link} ref={ref} />;
  }

  return <MacawButton href={href} {...props} ref={ref} />;
});

_Button.displayName = "Button";

/**
 * @deprecated - use macaw-ui-next Button instead
 */
export const Button = _Button as OverridableComponent<ButtonTypeMap>;
