import { isExternalURL } from "@dashboard/utils/urls";
import { IconButton as MacawIconButton, IconButtonProps } from "@saleor/macaw-ui";
import * as React from "react";
import { Link } from "react-router-dom";

const _IconButton = React.forwardRef<unknown, { href: string }>(({ href, ...props }, ref) => {
  if (href && !isExternalURL(href)) {
    // @ts-expect-error - migration
    return <MacawIconButton {...props} to={href} component={Link} ref={ref} />;
  }

  // @ts-expect-error - migration
  return <MacawIconButton href={href} {...props} ref={ref} />;
});

_IconButton.displayName = "IconButton";

/**
 * @deprecated
 */
export const IconButton = _IconButton as <T extends React.ElementType = "button">(
  props: IconButtonProps<T>,
) => ReturnType<typeof _IconButton>;
