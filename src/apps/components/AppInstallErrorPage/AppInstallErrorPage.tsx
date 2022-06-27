import errorImg from "@assets/images/app-install-error.svg";
import { Grid, Typography } from "@material-ui/core";
import { Button } from "@saleor/components/Button";
import Container from "@saleor/components/Container";
import React from "react";
import { FormattedMessage } from "react-intl";

import { useStyles } from "./styles";

interface AppInstallErrorPageProps {
  onBack: () => void;
}

export const AppInstallErrorPage: React.FC<AppInstallErrorPageProps> = ({
  onBack,
}) => {
  const classes = useStyles({});

  return (
    <Container className={classes.root}>
      <Grid spacing={3} alignItems="center" container>
        <Grid xs={12} sm={6} item>
          <img src={errorImg} alt="" />
        </Grid>
        <Grid xs={12} sm={6} item>
          <Typography variant="h3" component="h3">
            <FormattedMessage
              id="WnlZMO"
              defaultMessage="There’s a problem with app."
              description="title"
            />
          </Typography>
          <Typography variant="body2">
            <FormattedMessage
              id="4yRwN+"
              defaultMessage="Saleor couldn’t fetch crucial information regarding installation. Without those System can’t install the app in your Saleor. Please use the button below to get back to system’s dashboard."
              description="content"
            />
          </Typography>
          <Button className={classes.button} variant="primary" onClick={onBack}>
            <FormattedMessage
              id="906uUr"
              defaultMessage="Back to homepage"
              description="button"
            />
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AppInstallErrorPage;
