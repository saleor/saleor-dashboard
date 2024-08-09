import errorImg from "@assets/images/app-install-error.svg";
import { Button } from "@dashboard/components/Button";
import Container from "@dashboard/components/Container";
import { Grid } from "@material-ui/core";
import { Text } from "@saleor/macaw-ui-next";
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
          <Text size={6} fontWeight="bold" lineHeight={3} as="h3">
            <FormattedMessage {...messages.title} />
          </Text>
          <Text size={3} fontWeight="regular">
            <FormattedMessage {...messages.content} />
          </Text>
          <Button className={classes.button} variant="primary" onClick={onBack}>
            <FormattedMessage {...messages.backButton} />
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};
