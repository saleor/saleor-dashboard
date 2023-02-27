import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardTitle from "@dashboard/components/CardTitle";
import { Card, CardContent, Typography } from "@material-ui/core";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface HomeScreenProps {
  user: {
    email: string;
  };
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ user }) => {
  const intl = useIntl();

  return (
    <>
      <TopNav
        title={intl.formatMessage(
          {
            id: "By5ZBp",
            defaultMessage: "Hello there, {userName}",
            description: "header",
          },
          { userName: user.email },
        )}
      />
      <Card>
        <CardTitle
          title={intl.formatMessage({
            id: "6L6Fy2",
            defaultMessage: "Disclaimer",
            description: "header",
          })}
        />
        <CardContent>
          <Typography>
            <FormattedMessage
              id="5LRkEs"
              defaultMessage="The new dashboard and the GraphQL API are preview-quality software."
            />
          </Typography>
          <Typography>
            <FormattedMessage
              id="G7mu0y"
              defaultMessage="The GraphQL API is beta quality. It is not fully optimized and some mutations or queries may be missing."
            />
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};
