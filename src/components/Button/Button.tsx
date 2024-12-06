import { isExternalURL } from "@dashboard/utils/urls";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import { Button as MacawButton, ButtonTypeMap } from "@saleor/macaw-ui";
import * as React from "react";
import { Link } from "react-router-dom";

const _Button: React.FC<any> = React.forwardRef(({ href, ...props }, ref) => {
  if (href && !isExternalURL(href)) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return <MacawButton {...props} to={href} component={Link} ref={ref} />;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return <MacawButton href={href} {...props} ref={ref} />;
});

_Button.displayName = "Button";

export const Button = _Button as OverridableComponent<ButtonTypeMap>;
