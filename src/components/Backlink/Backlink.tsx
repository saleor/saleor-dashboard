import { isExternalURL } from "@dashboard/utils/urls";
import { Backlink as MacawBacklink, BacklinkProps } from "@saleor/macaw-ui";
import React from "react";
import { Link, LinkProps } from "react-router-dom";

type LinkType = React.FunctionComponent<LinkProps>;

export const Backlink = ({ href, ...props }: BacklinkProps<"a"> & BacklinkProps<"button">) => {
  if (href && !isExternalURL(href)) {
    return <MacawBacklink<LinkType> {...props} component={Link as unknown as LinkType} to={href} />;
  }

  if (href) {
    return <MacawBacklink<"a"> href={href} {...props} />;
  }

  return <MacawBacklink<"button"> {...props} />;
};
