import { MenuErrorCode } from "@saleor/graphql";
import { menu } from "@saleor/navigation/fixtures";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import MenuDetailsPage, { MenuDetailsPageProps } from "./MenuDetailsPage";

const props: MenuDetailsPageProps = {
  disabled: false,
  errors: [],
  menu,
  onDelete: () => undefined,
  onItemAdd: () => undefined,
  onItemClick: () => undefined,
  onItemEdit: () => undefined,
  onSubmit: () => undefined,
  saveButtonState: "default",
};

storiesOf("Navigation / Menu details", module)
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
        items: [],
      }}
    />
  ))
  .add("form errors", () => (
    <MenuDetailsPage
      {...props}
      errors={["name"].map(field => ({
        __typename: "MenuError",
        code: MenuErrorCode.INVALID,
        field,
        message: "Invalid field",
      }))}
    />
  ));
