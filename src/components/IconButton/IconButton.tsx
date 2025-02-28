import { isExternalURL } from "@dashboard/utils/urls";
import { IconButton as MacawIconButton, IconButtonProps } from "@saleor/macaw-ui";
import { ElementType, FC, forwardRef } from "react";
import { Link } from "react-router-dom";

const _IconButton: FC<any> = forwardRef(({ href, ...props }, ref) => {
  if (href && !isExternalURL(href)) {
    // @ts-expect-error old macaw Button component use legacy types for ref
    return <MacawIconButton {...props} to={href} component={Link} ref={ref} />;
  }

  // @ts-expect-error old macaw Button component use legacy types for ref
  return <MacawIconButton href={href} {...props} ref={ref} />;
});

_IconButton.displayName = "IconButton";

export const IconButton = _IconButton as <T extends ElementType = "button">(
  props: IconButtonProps<T>,
) => ReturnType<typeof _IconButton>;
