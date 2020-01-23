import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";

import Container from "@saleor/components/Container";
import AppHeader from "@saleor/components/AppHeader";

interface AppDetailsPageProps {
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
    name: "AppDetailsPage"
  }
);

const AppDetailsPage: React.FC<AppDetailsPageProps> = ({ app }) => {
  const classes = useStyles({});

  return (
    <Container>
      <AppHeader onBack={() => navigate(appList)}>Extensions</AppHeader>
      <div className={classes.frameContainer}>
        <iframe className={classes.frame} id="extension-app" src={app.url} />
      </div>
    </Container>
  );
};

export default AppDetailsPage;
