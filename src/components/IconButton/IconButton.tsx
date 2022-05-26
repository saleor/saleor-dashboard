import {
  IconButton as MacawIconButton,
  IconButtonProps,
} from "@saleor/macaw-ui";
import { isExternalURL } from "@saleor/utils/urls";
import React from "react";
import { Link } from "react-router-dom";

const _IconButton: React.FC<any> = React.forwardRef(
  ({ href, ...props }, ref) => {
    if (href && !isExternalURL(href)) {
      return (
        <MacawIconButton {...props} to={href} component={Link} ref={ref} />
      );
    }

    return <MacawIconButton href={href} {...props} ref={ref} />;
  },
);

export const IconButton = _IconButton as <
  T extends React.ElementType = "button"
>(
  props: IconButtonProps<T>,
) => ReturnType<typeof _IconButton>;
