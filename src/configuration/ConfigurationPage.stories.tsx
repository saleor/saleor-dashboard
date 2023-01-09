import { createConfigurationMenu } from "@saleor/configuration";
import { UserFragment } from "@saleor/graphql";
import { staffMember } from "@saleor/staff/fixtures";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";
import { useIntl } from "react-intl";

import ConfigurationPage from "./ConfigurationPage";

const user = {
  __typename: staffMember.__typename,
  avatar: {
    __typename: staffMember.avatar.__typename,
    url: staffMember.avatar.url,
  },
  email: staffMember.email,
  firstName: "Adam Evan",
  id: staffMember.id,
  isStaff: true,
  lastName: "Newton",
  note: null,
  userPermissions: staffMember.userPermissions,
};

const versions = {
  dashboardVersion: "3.0.0-b.3",
  coreVersion: "3.0.0-b.15",
};

const Story: React.FC<{ user: UserFragment }> = ({ user }) => {
  const intl = useIntl();

  return (
    <ConfigurationPage
      menu={createConfigurationMenu(intl)}
      user={user}
      versionInfo={versions}
    />
  );
};

storiesOf("Configuration", module)
  .addDecorator(Decorator)
  .add("default", () => <Story user={user} />)
  .add("partial access", () => (
    <Story
      user={{
        ...user,
        userPermissions: user.userPermissions.slice(2, 6),
      }}
    />
  ));
