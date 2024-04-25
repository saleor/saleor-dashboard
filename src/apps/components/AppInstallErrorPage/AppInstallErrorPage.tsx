import errorImg from "@assets/images/app-install-error.svg";
import { Button } from "@dashboard/components/Button";
import Container from "@dashboard/components/Container";
import { Grid, Typography } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";

import messages from "./messages";
import { useStyles } from "./styles";

interface AppInstallErrorPageProps {
  onBack: () => void;
}

export const AppInstallErrorPage: React.FC<AppInstallErrorPageProps> = ({ onBack }) => {
  const classes = useStyles();

  return (
    <Container className={classes.root}>
      <Grid spacing={3} alignItems="center" container>
        <Grid xs={12} sm={6} item>
          <img src={errorImg} alt="" />
        </Grid>
        <Grid xs={12} sm={6} item>
          <Typography variant="h3" component="h3">
            <FormattedMessage {...messages.title} />
          </Typography>
          <Typography variant="body2">
            <FormattedMessage {...messages.content} />
          </Typography>
          <Button className={classes.button} variant="primary" onClick={onBack}>
            <FormattedMessage {...messages.backButton} />
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};
