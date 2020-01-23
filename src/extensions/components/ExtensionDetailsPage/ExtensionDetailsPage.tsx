import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";

import Container from "@saleor/components/Container";
import AppHeader from "@saleor/components/AppHeader";
import { extensionListUrl } from "@saleor/extensions/urls";
import useNavigator from "@saleor/hooks/useNavigator";

interface ExtensionDetailsPageProps {
  app: Record<"id" | "name" | "url", string>;
}

const useStyles = makeStyles(
  {
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
    }
  },
  {
    name: "ExtensionDetailsPage"
  }
);

const ExtensionDetailsPage: React.FC<ExtensionDetailsPageProps> = ({ app }) => {
  const classes = useStyles({});
  const navigate = useNavigator();

  return (
    <Container>
      <AppHeader onBack={() => navigate(extensionListUrl)}>
        Extensions
      </AppHeader>
      <div className={classes.frameContainer}>
        <iframe className={classes.frame} id="extension-app" src={app.url} />
      </div>
    </Container>
  );
};

export default ExtensionDetailsPage;
