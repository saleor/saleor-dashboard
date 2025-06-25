// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { DashboardCard } from "@dashboard/components/Card";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { useFlag } from "@dashboard/featureFlags";
import { UserFragment } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { ExclamationIcon } from "@dashboard/icons/ExclamationIcon";
import { sectionNames } from "@dashboard/intl";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { NavigationCard } from "@saleor/macaw-ui";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import VersionInfo from "../components/VersionInfo";
import { useStyles } from "./styles";
import { MenuSection } from "./types";
import { hasUserMenuItemPermissions } from "./utils";

interface VersionInfo {
  dashboardVersion: string;
  coreVersion: string;
}

export interface ConfigurationPageProps {
  menu: MenuSection[];
  user: UserFragment;
  versionInfo: VersionInfo;
}

export const ConfigurationPage: React.FC<ConfigurationPageProps> = props => {
  const {
    menu: menus,
    user,
    versionInfo: { dashboardVersion, coreVersion },
  } = props;
  const classes = useStyles(props);
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
  const renderVersionInfo = (
    <VersionInfo dashboardVersion={dashboardVersion} coreVersion={coreVersion} />
  );
  const intl = useIntl();

  const { enabled: isExtensionsEnabled } = useFlag("extensions");
  const navigate = useNavigator();

  const goToExtensions = () => {
    navigate(ExtensionsUrls.resolveInstalledExtensionsUrl());
  };

  return (
    <DetailPageLayout gridTemplateColumns={1} withSavebar={false}>
      <TopNav title={intl.formatMessage(sectionNames.configuration)}>
        {isSmUp && renderVersionInfo}
      </TopNav>
      <DetailPageLayout.Content data-test-id="configuration-menu">
        <Box paddingX={6} __maxWidth={"1024px"} margin="auto">
          {menus
            .filter(menu =>
              menu.menuItems.some(menuItem => hasUserMenuItemPermissions(menuItem, user)),
            )
            .map((menu, menuIndex) => (
              <div className={classes.configurationCategory} key={menuIndex}>
                <div className={classes.configurationLabel}>
                  <Text>{menu.label}</Text>
                </div>
                <div className={classes.configurationItem}>
                  {menu.menuItems
                    .filter(
                      menuItem => hasUserMenuItemPermissions(menuItem, user) && !menuItem?.hidden,
                    )
                    .map((item, itemIndex) => (
                      <Link
                        className={classes.link}
                        to={item.url}
                        key={`${item.title}-${itemIndex}`}
                      >
                        <NavigationCard
                          className={classes.navigationCard}
                          key={itemIndex}
                          icon={item.icon}
                          title={item.title}
                          description={item.description}
                          data-test-id={
                            item.testId + "-settings-subsection-" + item.title.toLowerCase()
                          }
                        />
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          {isExtensionsEnabled && (
            <Box marginY={4}>
              <DashboardCard withBorder gap={2} __width="fit-content">
                <DashboardCard.Title display="flex" gap={3} alignItems="center">
                  <ExclamationIcon />
                  <FormattedMessage defaultMessage="Navigation has changed" id="V1aPhG" />
                </DashboardCard.Title>
                <DashboardCard.Content fontSize={3} paddingRight={0}>
                  <FormattedMessage
                    defaultMessage={`Plugins and Webhook Events have been moved to the "Extensions" page, available from the sidebar navigation.`}
                    id="Dqo3Vf"
                  />

                  <Button
                    onClick={goToExtensions}
                    variant="primary"
                    size="small"
                    style={{ marginTop: 8 }}
                  >
                    <FormattedMessage defaultMessage="Go to Extensions" id="vZglQ7" />
                  </Button>
                </DashboardCard.Content>
              </DashboardCard>
            </Box>
          )}
        </Box>
      </DetailPageLayout.Content>
    </DetailPageLayout>
  );
};

ConfigurationPage.displayName = "ConfigurationPage";
