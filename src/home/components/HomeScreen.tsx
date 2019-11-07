import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";

interface HomeScreenProps {
  user: {
    email: string;
  };
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ user }) => {
  const intl = useIntl();

  return (
    <Container>
      <PageHeader
        title={intl.formatMessage(
          {
            defaultMessage: "Hello there, {userName}",
            description: "header",
            id: "homeScreenHeader"
          },
          { userName: user.email }
        )}
      />
      <Card>
        <CardTitle
          title={intl.formatMessage({
            defaultMessage: "Disclaimer",
            description: "header",
            id: "homeScreenDisclaimer"
          })}
        />
        <CardContent>
          <Typography>
            <FormattedMessage
              defaultMessage="The new dashboard and the GraphQL API are preview-quality software."
              id="homeScreenDisclaimerText1"
            />
          </Typography>
          <Typography>
            <FormattedMessage
              defaultMessage="The GraphQL API is beta quality. It is not fully optimized and some mutations or queries may be missing."
              id="homeScreenDisclaimerText2"
            />
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};
