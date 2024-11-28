import { useUser } from "@dashboard/auth";
import { getUserName } from "@dashboard/misc";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

export const WelcomePageTitle = () => {
  const { user } = useUser();
  const userName = getUserName(user, true);

  return (
    <Text as="h1" size={9}>
      <FormattedMessage
        defaultMessage="Hello {userName}, welcome to your Store Dashboard"
        id="0+zatS"
        values={{
          userName,
        }}
      />
    </Text>
  );
};
