import { DashboardCard } from "@dashboard/components/Card";
import { Link } from "@dashboard/components/Link";
import { AppAvatar } from "@dashboard/extensions/components/AppAvatar/AppAvatar";
import { widgetMessages } from "@dashboard/extensions/messages";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import useNavigator from "@dashboard/hooks/useNavigator";
import { Box, Text } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

import styles from "./AppWidgetCard.module.css";
import { type AppWidgetCardExtension } from "./appWidgetCardExtension";
import { resolveWidgetTitle } from "./resolveWidgetTitle";

export type { AppWidgetCardExtension };

interface AppWidgetCardProps {
  extension: AppWidgetCardExtension;
  children: ReactNode;
  contentMinHeight?: number;
  "data-test-id"?: string;
}

export const AppWidgetCard = ({
  extension,
  children,
  contentMinHeight,
  "data-test-id": dataTestId,
}: AppWidgetCardProps) => {
  const navigate = useNavigator();
  const intl = useIntl();
  const logo = extension.app.brand?.logo.default;
  const appPageUrl = ExtensionsUrls.resolveViewManifestExtensionUrl(extension.app.id, {});
  const fallbackTitle = intl.formatMessage(widgetMessages.fallbackTitle);
  const widgetTitle = resolveWidgetTitle(extension, fallbackTitle);
  const appName = extension.app.name?.trim() ?? "";
  const ariaLabel =
    appName && appName !== widgetTitle
      ? intl.formatMessage(widgetMessages.headerAriaLabel, {
          extensionLabel: widgetTitle,
          appName,
        })
      : widgetTitle;
  const tooltipTitle = appName && appName !== widgetTitle ? appName : undefined;

  return (
    <DashboardCard gap={0} data-test-id={dataTestId}>
      <DashboardCard.Header paddingTop={4} paddingBottom={2}>
        <Box className={styles.headerWrapper}>
          <Link
            href={appPageUrl}
            color="secondary"
            underline={false}
            inline={false}
            className={styles.headerLink}
            aria-label={ariaLabel}
            title={tooltipTitle}
            data-test-id="app-widget-card-header-link"
            onClick={() => navigate(appPageUrl)}
          >
            <AppAvatar
              variant="plain"
              size={6}
              logo={logo ? { source: logo } : undefined}
              flexShrink="0"
            />
            <Text size={3} className={styles.label}>
              {widgetTitle}
            </Text>
          </Link>
        </Box>
      </DashboardCard.Header>
      <DashboardCard.Content paddingTop={0}>
        <Box
          display="flex"
          flexDirection="column"
          width="100%"
          height="100%"
          __minHeight={contentMinHeight}
        >
          {children}
        </Box>
      </DashboardCard.Content>
    </DashboardCard>
  );
};
