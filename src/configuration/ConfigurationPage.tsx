// @ts-strict-ignore

import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { DetailPageLayout } from "@dashboard/components/Layouts/Detail";
import { type UserFragment } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Box, Paragraph, Text } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";

import VersionInfo from "../components/VersionInfo/VersionInfo";
import {
  ConfigurationSettingsSearchResults,
  ConfigurationSettingsSearchToolbar,
  getConfigurationSettingsOptionId,
} from "./ConfigurationSettingsSearch";
import navigationCardStyles from "./navigation-card.module.css";
import { useStyles } from "./styles";
import { type MenuSection } from "./types";
import { useConfigurationSettingsSearchKeyboard } from "./useConfigurationSettingsSearchKeyboard";
import { hasUserMenuItemPermissions } from "./utils";

interface VersionInfo {
  dashboardVersion: string;
  coreVersion: string;
}

interface ConfigurationPageProps {
  menu: MenuSection[];
  user: UserFragment;
  versionInfo: VersionInfo;
}

export const ConfigurationPage = (props: ConfigurationPageProps) => {
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
  const [settingsQuery, setSettingsQuery] = useState("");
  const showMenu = settingsQuery.trim().length === 0;
  const { results, activeIndex, onSearchKeyDown, setActiveIndex } =
    useConfigurationSettingsSearchKeyboard(settingsQuery);
  const activeOptionId =
    activeIndex >= 0 && results[activeIndex]
      ? getConfigurationSettingsOptionId(results[activeIndex].id)
      : undefined;

  return (
    <DetailPageLayout gridTemplateColumns={1} withSavebar={false}>
      <TopNav title={intl.formatMessage(sectionNames.configuration)}>
        {isSmUp && renderVersionInfo}
      </TopNav>
      <DetailPageLayout.Content data-test-id="configuration-menu">
        <ConfigurationSettingsSearchToolbar
          query={settingsQuery}
          onQueryChange={setSettingsQuery}
          onKeyDown={onSearchKeyDown}
          activeOptionId={activeOptionId}
        />
        <Box paddingX={6} paddingBottom={6} __maxWidth={"1024px"} margin="auto">
          {showMenu ? (
            menus
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
                          <Box
                            gap={2}
                            padding={6}
                            className={navigationCardStyles.navigationCard}
                            borderStyle="solid"
                            borderColor="defaultDisabled"
                            borderRadius={4}
                            key={itemIndex}
                            borderWidth={1}
                            data-test-id={
                              item.testId + "-settings-subsection-" + item.title.toLowerCase()
                            }
                            display="flex"
                            position="relative"
                          >
                            <Box>{item.icon}</Box>
                            <Box>
                              <Text fontSize={3} fontWeight="medium">
                                {item.title}
                              </Text>
                              <Paragraph fontSize={3} color="default2" marginTop={1}>
                                {item.description}
                              </Paragraph>
                            </Box>
                            {item.ripple && (
                              // The tile itself is a link — reading the hint must not navigate.
                              <Box
                                position="absolute"
                                __top="12px"
                                __right="12px"
                                onClick={event => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                }}
                              >
                                <Ripple model={item.ripple} />
                              </Box>
                            )}
                          </Box>
                        </Link>
                      ))}
                  </div>
                </div>
              ))
          ) : (
            <ConfigurationSettingsSearchResults
              query={settingsQuery}
              results={results}
              activeIndex={activeIndex}
              onActiveIndexChange={setActiveIndex}
            />
          )}
        </Box>
      </DetailPageLayout.Content>
    </DetailPageLayout>
  );
};

ConfigurationPage.displayName = "ConfigurationPage";
