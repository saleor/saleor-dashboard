import { Typography } from "@material-ui/core";
import { IconProps } from "@material-ui/core/Icon";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { PermissionEnum, UserFragment } from "@saleor/graphql";
import { sectionNames } from "@saleor/intl";
import { makeStyles, NavigationCard } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { hasAnyPermissions } from "../auth/misc";
import Container from "../components/Container";
import PageHeader from "../components/PageHeader";
import VersionInfo from "../components/VersionInfo";

export interface MenuItem {
  description: string;
  icon: React.ReactElement<IconProps>;
  permissions: PermissionEnum[];
  title: string;
  url?: string;
  testId?: string;
}

export interface MenuSection {
  label: string;
  menuItems: MenuItem[];
}

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
      borderTop: `solid 1px ${theme.palette.divider}`,
      display: "grid",
      gap: theme.spacing(4),
      gridTemplateColumns: "1fr 3fr",
      padding: theme.spacing(4, 0),
    },
    configurationItem: {
      [theme.breakpoints.down("md")]: {
        gridTemplateColumns: "1fr",
      },
      display: "grid",
      gap: theme.spacing(4),
      gridTemplateColumns: "1fr 1fr",
    },
    configurationLabel: {
      paddingBottom: 20,
    },
    header: {
      margin: 0,
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
      fontWeight: 600 as 600,
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
    <VersionInfo
      dashboardVersion={dashboardVersion}
      coreVersion={coreVersion}
    />
  );

  const intl = useIntl();

  return (
    <Container>
      {!isSmUp && renderVersionInfo}
      <PageHeader
        className={classes.header}
        title={intl.formatMessage(sectionNames.configuration)}
      >
        {isSmUp && renderVersionInfo}
      </PageHeader>
      {menus
        .filter(menu =>
          menu.menuItems.some(menuItem =>
            hasAnyPermissions(menuItem.permissions, user),
          ),
        )
        .map((menu, menuIndex) => (
          <div className={classes.configurationCategory} key={menuIndex}>
            <div className={classes.configurationLabel}>
              <Typography>{menu.label}</Typography>
            </div>
            <div className={classes.configurationItem}>
              {menu.menuItems
                .filter(menuItem =>
                  hasAnyPermissions(menuItem.permissions, user),
                )
                .map((item, itemIndex) => (
                  <Link className={classes.link} to={item.url}>
                    <NavigationCard
                      key={itemIndex}
                      icon={item.icon}
                      title={item.title}
                      description={item.description}
                      data-test-id={
                        item.testId +
                        "-settings-subsection-" +
                        item.title.toLowerCase()
                      }
                    />
                  </Link>
                ))}
            </div>
          </div>
        ))}
    </Container>
  );
};
ConfigurationPage.displayName = "ConfigurationPage";
export default ConfigurationPage;
