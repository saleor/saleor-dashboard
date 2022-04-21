import { Backlink as MacawBacklink, BacklinkProps } from "@saleor/macaw-ui";
import { isExternalURL } from "@saleor/utils/urls";
import React from "react";
import { Link } from "react-router-dom";

export const Backlink = ({ href, ...props }: BacklinkProps) => {
  if (href && !isExternalURL(href)) {
    return <MacawBacklink component={Link} to={href} {...props} />;
  }

  return <MacawBacklink href={href} {...props} />;
};
