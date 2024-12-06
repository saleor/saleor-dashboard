import { isExternalURL } from "@dashboard/utils/urls";
import { IconButton as MacawIconButton, IconButtonProps } from "@saleor/macaw-ui";
import * as React from "react";
import { Link } from "react-router-dom";

const _IconButton: React.FC<any> = React.forwardRef(({ href, ...props }, ref) => {
  if (href && !isExternalURL(href)) {
    return <MacawIconButton {...props} to={href} component={Link} ref={ref} />;
  }

  return <MacawIconButton href={href} {...props} ref={ref} />;
});

_IconButton.displayName = "IconButton";

export const IconButton = _IconButton as <T extends React.ElementType = "button">(
  props: IconButtonProps<T>,
) => ReturnType<typeof _IconButton>;
