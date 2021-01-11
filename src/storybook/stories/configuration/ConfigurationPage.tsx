import { createConfigurationMenu } from "@saleor/configuration";
import ConfigurationPage from "@saleor/configuration/ConfigurationPage";
import { User } from "@saleor/fragments/types/User";
import { staffMember } from "@saleor/staff/fixtures";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";
import { useIntl } from "react-intl";

const user = {
  __typename: staffMember.__typename,
  avatar: {
    __typename: staffMember.avatar.__typename,
    url: staffMember.avatar.url
  },
  email: staffMember.email,
  firstName: "Adam Evan",
  id: staffMember.id,
  isStaff: true,
  lastName: "Newton",
  note: null,
  userPermissions: staffMember.userPermissions
};

const Story: React.FC<{ user: User }> = ({ user }) => {
  const intl = useIntl();

  return (
    <ConfigurationPage
      menu={createConfigurationMenu(intl)}
      onSectionClick={() => undefined}
      user={user}
    />
  );
};

storiesOf("Views / Configuration", module)
  .addDecorator(Decorator)
  .add("default", () => <Story user={user} />)
  .add("partial access", () => (
    <Story
      user={{
        ...user,
        userPermissions: user.userPermissions.slice(2, 6)
      }}
    />
  ));
