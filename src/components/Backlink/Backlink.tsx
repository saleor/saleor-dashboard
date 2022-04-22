import { Backlink as MacawBacklink, BacklinkProps } from "@saleor/macaw-ui";
import { isExternalURL } from "@saleor/utils/urls";
import React from "react";
import { Link, LinkProps } from "react-router-dom";

type LinkType = React.FunctionComponent<LinkProps>;

export const Backlink = (
  props: BacklinkProps<"a"> & BacklinkProps<"button">
) => {
  const { href } = props;

  if (href && !isExternalURL(href)) {
    return (
      <MacawBacklink<LinkType>
        {...props}
        component={(Link as unknown) as LinkType}
        to={href}
      />
    );
  }

  if (href) {
    return <MacawBacklink<"a"> {...props} />;
  }

  return <MacawBacklink<"button"> {...props} />;
};
