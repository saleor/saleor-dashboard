import ExternalLink from "@dashboard/components/ExternalLink";
import { OrdersIcon } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import SVG from "react-inlinesvg";
import { FormattedMessage } from "react-intl";

import githubLogo from "../../../assets/images/github-logo.svg";
import graphQl from "../../../assets/images/graphql.svg";
import { SALEOR_GRAPHQL_URL, SALEOR_STOREFRONT_URL } from "./constants";
import styles from "./styles";

const DemoBanner: React.FC = () => {
  const classes = styles();
  const [isHidden, setIsHidden] = useState(false);

  return (
    <div
      className={`${classes.wrapper} ${isHidden ? classes.hidden : ``}`}
      onMouseEnter={() => setIsHidden(false)}
      onTouchEnd={() => setIsHidden(false)}
    >
      <div className={classes.header}>
        <p>Demo mode</p>
        <span className={classes.close} onClick={() => setIsHidden(true)}>
          Hide
        </span>
      </div>
      <div>
        <ExternalLink className={classes.link} target={"_blank"} href={SALEOR_STOREFRONT_URL}>
          <div className={classes.icon}>
            <OrdersIcon />
          </div>
          <FormattedMessage id="LmKz3g" defaultMessage="Storefront" />
        </ExternalLink>

        <ExternalLink className={classes.link} target={"_blank"} href={SALEOR_GRAPHQL_URL}>
          <SVG src={graphQl} className={classes.icon} />
          <FormattedMessage id="0VkxrS" defaultMessage="GraphQL Playground" />
        </ExternalLink>

        <ExternalLink
          target={"_blank"}
          className={classes.link}
          href={"https://github.com/saleor/saleor"}
        >
          <SVG src={githubLogo} className={classes.icon} />
          <FormattedMessage id="vSy+II" defaultMessage="Star on Github" />
        </ExternalLink>
      </div>
    </div>
  );
};

DemoBanner.displayName = "DemoBanner";
export default DemoBanner;
