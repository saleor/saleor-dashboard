import { MenuErrorCode } from "@saleor/types/globalTypes";
import { storiesOf } from "@storybook/react";
import React from "react";

import MenuDetailsPage, {
  MenuDetailsPageProps
} from "../../../navigation/components/MenuDetailsPage";
import { menu } from "../../../navigation/fixtures";
import Decorator from "../../Decorator";

const props: MenuDetailsPageProps = {
  disabled: false,
  errors: [],
  menu,
  onBack: () => undefined,
  onDelete: () => undefined,
  onItemAdd: () => undefined,
  onItemClick: () => undefined,
  onItemEdit: () => undefined,
  onSubmit: () => undefined,
  saveButtonState: "default"
};

storiesOf("Views / Navigation / Menu details", module)
  .addDecorator(Decorator)
  .add("default", () => <MenuDetailsPage {...props} />)
  .add("loading", () => (
    <MenuDetailsPage {...props} disabled={true} menu={undefined} />
  ))
  .add("no data", () => (
    <MenuDetailsPage
      {...props}
      menu={{
        ...props.menu,
        items: []
      }}
    />
  ))
  .add("form errors", () => (
    <MenuDetailsPage
      {...props}
      errors={["name"].map(field => ({
        __typename: "MenuError",
        code: MenuErrorCode.INVALID,
        field
      }))}
    />
  ));
