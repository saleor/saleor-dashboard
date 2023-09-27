// @ts-strict-ignore
import { createConfigurationMenu } from "@dashboard/configuration";
import { UserFragment } from "@dashboard/graphql";
import { staffMember } from "@dashboard/staff/fixtures";
import React from "react";
import { useIntl } from "react-intl";

import { ConfigurationPage } from "./ConfigurationPage";

export default {
  title: "Configuration / Configuration",
};

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
  restrictedAccessToChannels: false,
  accessibleChannels: [],
  metadata: [],
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

export const Default = () => <Story user={user} />;

export const PartialAccess = () => (
  <Story
    user={{
      ...user,
      userPermissions: user.userPermissions.slice(2, 6),
    }}
  />
);
