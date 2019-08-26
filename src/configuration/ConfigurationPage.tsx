import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { useIntl } from "react-intl";

import { IconProps } from "@material-ui/core/Icon";
import { sectionNames } from "@saleor/intl";
import { User } from "../auth/types/User";
import Container from "../components/Container";
import PageHeader from "../components/PageHeader";
import { PermissionEnum } from "../types/globalTypes";

export interface MenuItem {
  description: string;
  icon: React.ReactElement<IconProps>;
  permission: PermissionEnum;
  title: string;
  url?: string;
}

const styles = (theme: Theme) =>
  createStyles({
    card: {
      "&:hover": {
        boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.15);"
      },
      cursor: "pointer",
      marginBottom: theme.spacing.unit * 3,
      transition: theme.transitions.duration.standard + "ms"
    },
    cardContent: {
      // Overrides Material-UI default theme
      "&:last-child": {
        paddingBottom: 16
      },
      display: "grid",
      gridColumnGap: theme.spacing.unit * 4 + "px",
      gridTemplateColumns: "48px 1fr"
    },
    cardDisabled: {
      "& $icon, & $sectionTitle, & $sectionDescription": {
        color: theme.palette.text.disabled
      },
      marginBottom: theme.spacing.unit * 3
    },
    icon: {
      color: theme.palette.primary.main,
      fontSize: 48
    },
    root: {
      [theme.breakpoints.down("md")]: {
        gridTemplateColumns: "1fr"
      },
      display: "grid",
      gridColumnGap: theme.spacing.unit * 4 + "px",
      gridTemplateColumns: "1fr 1fr"
    },
    sectionDescription: {},
    sectionTitle: {
      fontSize: 20,
      fontWeight: 600 as 600
    }
  });

export interface ConfigurationPageProps {
  menu: MenuItem[];
  user: User;
  onSectionClick: (sectionName: string) => void;
}

export const ConfigurationPage = withStyles(styles, {
  name: "ConfigurationPage"
})(
  ({
    classes,
    menu,
    user,
    onSectionClick
  }: ConfigurationPageProps & WithStyles<typeof styles>) => {
    const intl = useIntl();

    return (
      <Container>
        <PageHeader title={intl.formatMessage(sectionNames.configuration)} />
        <div className={classes.root}>
          {menu
            .filter(menuItem =>
              user.permissions
                .map(perm => perm.code)
                .includes(menuItem.permission)
            )
            .map((menuItem, menuItemIndex) => (
              <Card
                className={menuItem.url ? classes.card : classes.cardDisabled}
                onClick={() => onSectionClick(menuItem.url)}
                key={menuItemIndex}
              >
                <CardContent className={classes.cardContent}>
                  <div className={classes.icon}>{menuItem.icon}</div>
                  <div>
                    <Typography
                      className={classes.sectionTitle}
                      color="primary"
                    >
                      {menuItem.title}
                    </Typography>
                    <Typography className={classes.sectionDescription}>
                      {menuItem.description}
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </Container>
    );
  }
);
ConfigurationPage.displayName = "ConfigurationPage";
export default ConfigurationPage;
