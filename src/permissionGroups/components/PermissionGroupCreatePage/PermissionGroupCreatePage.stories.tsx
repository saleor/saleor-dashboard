import { storiesOf } from "@storybook/react";
import React from "react";

import PermissionGroupCreatePage, {
  PermissionGroupCreatePageProps
} from "@saleor/permissionGroups/components/PermissionGroupCreatePage";
import Decorator from "@saleor/storybook/Decorator";

const props: PermissionGroupCreatePageProps = {
  disabled: false,
  onBack: () => undefined
};

storiesOf("Views / Permission Groups / Permission Group Create", module)
  .addDecorator(Decorator)
  .add("default", () => <PermissionGroupCreatePage {...props} />)
  .add("loading", () => (
    <PermissionGroupCreatePage {...props} disabled={true} />
  ));
