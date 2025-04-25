// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { UserFragment } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { makeStyles, NavigationCard } from "@saleor/macaw-ui";
import { Box, Text, vars } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";

import VersionInfo from "../components/VersionInfo";
import { MenuSection } from "./types";
import { hasUserMenuItemPermissions } from "./utils";

interface VersionInfo {
  dashboardVersion: string;
  coreVersion: string;
}

const useStyles = makeStyles(
  theme => ({
    configurationCategory: {
      [theme.breakpoints.down("md")]: {
        gridTemplateColumns: "1fr",
      },
      display: "grid",
      gap: theme.spacing(4),
      gridTemplateColumns: "1fr 3fr",
      padding: theme.spacing(4, 0),
    },

    configurationItem: {
      display: "grid",
      gap: theme.spacing(4),
      gridTemplateColumns: "1fr 1fr",
    },
    configurationLabel: {
      paddingBottom: 20,
    },

    link: {
      display: "contents",
      marginBottom: theme.spacing(4),
    },
    icon: {
      "& path": {
        fill: theme.palette.primary.main,
      },
      fontSize: 48,
    },
    sectionDescription: {},
    sectionTitle: {
      fontSize: 20,
      fontWeight: 600 as const,
    },
    navigationCard: {
      border: `1px solid ${vars.colors.border.default1}`,
      height: 130,
      boxShadow: "none !important",
      "& .MuiCardContent-root": {
        borderRadius: vars.borderRadius[3],
      },
    },
  }),
  { name: "ConfigurationPage" },
);

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
                    .filter(menuItem => hasUserMenuItemPermissions(menuItem, user))
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
        </Box>
      </DetailPageLayout.Content>
    </DetailPageLayout>
  );
};

ConfigurationPage.displayName = "ConfigurationPage";
