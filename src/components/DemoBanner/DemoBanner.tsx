import ExternalLink from "@saleor/components/ExternalLink";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

import { emphasisedTextBlue, greyDark, textColor } from "./constants";
export const mediumScreen = 720;

const useStyles = makeStyles(
  theme => ({
    wrapper: {
      width: "100%",
      backgroundColor: "inherit",
      padding: `0 13px`,
      fontSize: theme.spacing(1.5)
    },
    borderedWrapper: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      maxHeight: theme.spacing(7.5),
      flex: "0 0 auto",
      padding: theme.spacing(3, 0),
      backgroundImage: `linear-gradient(to right,  ${greyDark} 13%, rgba(255, 255, 255, 0) 0%)`,
      backgroundPosition: "bottom",
      backgroundSize: theme.spacing(1.5, 0.125),
      backgroundRepeat: "repeat-x"
    },
    logoWrapper: {
      lineHeight: 0
    },
    linkList: {
      display: "flex",
      alignItems: "center"
    },
    link: {
      display: "flex",
      padding: theme.spacing(2),
      color: textColor
    },
    textEmphasis: {
      color: emphasisedTextBlue,
      textTransform: "uppercase",
      fontWeight: 600,
      paddingLeft: "5px"
    },
    divider: {
      borderRight: `1px solid  ${greyDark}`,
      height: theme.spacing(2)
    },
    mediaMedium: {
      display: "flex",
      [theme.breakpoints.up(mediumScreen)]: {
        display: "none"
      }
    },
    mediaLarge: {
      display: "flex",
      alignItems: "center",
      [theme.breakpoints.down(mediumScreen)]: {
        display: "none"
      }
    }
  }),
  {
    name: "DemoBanner"
  }
);

export const DemoBanner: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <div className={classes.borderedWrapper}>
        <div />
        <div className={classes.linkList}>
          <div className={classes.mediaMedium}>
            <ExternalLink
              className={classes.link}
              href={"https://demo.saleor.io/graphql/"}
            >
              <div className={classes.textEmphasis}>
                <FormattedMessage defaultMessage="API" />
              </div>
            </ExternalLink>
            <ExternalLink
              className={classes.link}
              target="_blank"
              href="https://demo.saleor.io/dashboard/"
            >
              <div className={classes.textEmphasis}>
                <FormattedMessage defaultMessage="Dashboard" />
              </div>
            </ExternalLink>
          </div>

          <div className={classes.mediaLarge}>
            <ExternalLink
              className={classes.link}
              href="https://demo.saleor.io/dashboard/"
            >
              <FormattedMessage
                defaultMessage="Explore <emphasis>Store’s dashboard</emphasis>"
                values={{
                  emphasis: (children: any) => (
                    <div className={classes.textEmphasis}>{children}</div>
                  )
                }}
              />
            </ExternalLink>
            <div className={classes.divider} />
            <ExternalLink
              className={classes.link}
              href="https://demo.saleor.io/graphql/"
            >
              <FormattedMessage
                defaultMessage="Play with <emphasis>GraphQL API</emphasis>"
                values={{
                  emphasis: (children: any) => (
                    <div className={classes.textEmphasis}>{children}</div>
                  )
                }}
              />
            </ExternalLink>
          </div>
        </div>
      </div>
    </div>
  );
};

DemoBanner.displayName = "DemoBanner";
export default DemoBanner;
