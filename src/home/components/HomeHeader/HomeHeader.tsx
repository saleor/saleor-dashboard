import { Skeleton, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

interface HomeHeaderProps {
  userName: string;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ userName }: HomeHeaderProps) => (
  <div data-test-id="home-header">
    <Text size={4} fontWeight="bold" as="h4" data-test-id="welcome-header">
      {userName ? (
        <FormattedMessage
          id="By5ZBp"
          defaultMessage="Hello there, {userName}"
          description="header"
          values={{
            userName,
          }}
        />
      ) : (
        <Skeleton style={{ width: "10em" }} />
      )}
    </Text>
    <Text size={3}>
      {userName ? (
        <FormattedMessage
          id="aCX8rl"
          defaultMessage="Here is some information we gathered about your store"
          description="subheader"
        />
      ) : (
        <Skeleton style={{ width: "10em" }} />
      )}
    </Text>
  </div>
);
