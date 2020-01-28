import React from "react";
import { FormattedMessage } from "react-intl";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import classNames from "classnames";

import Container from "@saleor/components/Container";
import AppHeader from "@saleor/components/AppHeader";
import { extensionListUrl } from "@saleor/extensions/urls";
import useNavigator from "@saleor/hooks/useNavigator";
import { sectionNames } from "@saleor/intl";
import Hr from "@saleor/components/Hr";
import useExtensionBreadcrumbs from "./useExtensionBreadcrumbs";

interface ExtensionDetailsPageProps {
  app: Record<"id" | "author" | "icon" | "name" | "url", string>;
  onBack: () => void;
}

const useStyles = makeStyles(
  theme => ({
    breadcrumb: {
      "&:not(:last-child)": {
        "&:after": {
          content: "'/'",
          display: "block",
          position: "absolute",
          right: -theme.spacing(2),
          top: 0
        },
        "&:not(:first-child):hover": {
          cursor: "pointer",
          textDecoration: "underline"
        }
      },
      marginRight: theme.spacing(3),
      position: "relative"
    },
    breadcrumbContainer: {
      alignItems: "center",
      display: "flex"
    },
    breadcrumbDisabled: {
      "&:hover": {
        textDecoration: "none"
      },
      color: theme.palette.text.disabled
    },
    breadcrumbs: {
      display: "flex"
    },
    flex: {
      flex: 1
    },
    frame: {
      border: "none",
      height: "100%",
      left: 0,
      position: "absolute",
      top: 0,
      width: "100%"
    },
    frameContainer: {
      overflow: "hidden",
      paddingTop: "56.25%",
      position: "relative"
    },
    hr: {
      margin: theme.spacing(3, 0)
    },
    icon: {
      height: 48,
      marginRight: theme.spacing(2),
      width: 48
    }
  }),
  {
    name: "ExtensionDetailsPage"
  }
);

const ExtensionDetailsPage: React.FC<ExtensionDetailsPageProps> = ({
  app,
  onBack
}) => {
  const classes = useStyles({});
  const [breadcrumbs, onBreadcrumbClick] = useExtensionBreadcrumbs();

  return (
    <Container>
      <AppHeader onBack={onBack}>
        <FormattedMessage {...sectionNames.extensions} />
      </AppHeader>
      <div className={classes.breadcrumbContainer}>
        <img className={classes.icon} src={app.icon} />
        <div className={classes.breadcrumbs}>
          <Typography
            className={classNames(
              classes.breadcrumb,
              classes.breadcrumbDisabled
            )}
            variant="h5"
          >
            {app.name}
          </Typography>
          {breadcrumbs.map(b => (
            <Typography
              className={classes.breadcrumb}
              variant="h5"
              onClick={() => onBreadcrumbClick(b.value)}
              key={b.label}
            >
              {b.label}
            </Typography>
          ))}
        </div>
        <div className={classes.flex} />
        <Typography>
          <FormattedMessage
            defaultMessage="by {author}"
            description="extension author"
            values={{
              author: app.author
            }}
          />
        </Typography>
      </div>
      <Hr className={classes.hr} />
      <div className={classes.frameContainer}>
        <iframe className={classes.frame} id="extension-app" src={app.url} />
      </div>
    </Container>
  );
};

export default ExtensionDetailsPage;
