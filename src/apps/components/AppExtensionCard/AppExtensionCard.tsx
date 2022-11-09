import appsIcon from "@assets/images/menu-apps-icon.svg";
import { Card, CardContent, CardProps } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import { makeStyles } from "@saleor/macaw-ui";
import clsx from "clsx";
import React, { CSSProperties, useMemo } from "react";
import SVG from "react-inlinesvg";

interface AppExtensionCardProps extends CardProps {
  appUrl: string;
  height?: string | number;
}

const useStyles = makeStyles(
  () => ({
    iframe: {
      width: "100%",
      height: "100%",
      border: "none",
    },
    card: {},
  }),
  { name: "AppFrame" },
);

// todo load iframe loader
export const AppExtensionCard = ({
  appUrl,
  className,
  height = 200,
  ...props
}: AppExtensionCardProps) => {
  const styles = useStyles();

  const rootStyles = useMemo(
    (): CSSProperties => ({
      height,
    }),
    [height],
  );

  return (
    <Card
      style={rootStyles}
      className={clsx(className, styles.card)}
      {...props}
    >
      <CardTitle
        title="Shipping Labels"
        toolbar={
          <span>
            <SVG src={appsIcon} />
          </span>
        }
      />
      <CardContent>
        <iframe className={styles.iframe} src={appUrl}></iframe>
      </CardContent>
    </Card>
  );
};
