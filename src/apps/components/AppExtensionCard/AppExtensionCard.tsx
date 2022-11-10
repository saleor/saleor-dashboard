import appsIcon from "@assets/images/menu-apps-icon.svg";
import { Card, CardContent, CardProps } from "@material-ui/core";
import { useAppActions } from "@saleor/apps/components/AppFrame/useAppActions";
import CardTitle from "@saleor/components/CardTitle";
import { useAppQuery } from "@saleor/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import clsx from "clsx";
import React, { CSSProperties, useEffect, useMemo, useRef } from "react";
import SVG from "react-inlinesvg";

interface AppExtensionCardProps extends CardProps {
  appUrl: string;
  height?: string | number;
  params: Record<string, string>;
  shouldLoad?: boolean;
}

const useStyles = makeStyles(
  () => ({
    iframe: {
      width: "100%",
      height: "100%",
      border: "none",
    },
    card: {},
    cardContent: {
      overflow: "auto",
    },
  }),
  { name: "AppFrame" },
);

export const AppExtensionCard = ({
  appUrl,
  className,
  height = 200,
  params,
  shouldLoad,
  ...props
}: AppExtensionCardProps) => {
  const styles = useStyles();
  const rootRef = useRef<HTMLElement | null>(null);
  const frameRef = React.useRef<HTMLIFrameElement>();

  const { data } = useAppQuery({
    displayLoader: true,
    variables: { id: "QXBwOjM0" }, // temp, should load actual app
  });

  const rootStyles = useMemo(
    (): CSSProperties => ({
      height,
    }),
    [height],
  );

  useEffect(() => {
    if (rootRef.current) {
      const titleBar = rootRef.current.querySelector<HTMLDivElement>(
        ".MuiCardHeader-root",
      );
      const headerHeight = titleBar.getBoundingClientRect().height;

      rootRef.current.querySelector<HTMLDivElement>(
        `.${styles.cardContent}`,
      )!.style.height = `calc(100% - ${headerHeight}px)`;
    }
  }, [rootRef, styles.cardContent]);

  const appOrigin = new URL(appUrl).origin;

  const { postToExtension } = useAppActions(frameRef, appOrigin, data?.app?.id);

  const handleLoad = () => {
    postToExtension({
      type: "handshake",
      payload: {
        token: data?.app.accessToken,
        version: 1,
      },
    });
  };

  const qs = new URLSearchParams(params);

  return (
    <Card
      ref={rootRef}
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
      <CardContent className={styles.cardContent}>
        <div>
          {shouldLoad && (
            <iframe
              ref={frameRef}
              onLoad={handleLoad}
              className={styles.iframe}
              src={`${appOrigin}/api/preload?url=${appUrl}?${qs.toString()}`}
            ></iframe>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
