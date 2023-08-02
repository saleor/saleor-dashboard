// @ts-strict-ignore
import { MenuErrorCode } from "@dashboard/graphql";
import { menu } from "@dashboard/navigation/fixtures";
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

export default {
  title: "Navigation / Menu details",
};

export const Default = () => <MenuDetailsPage {...props} />;

export const Loading = () => (
  <MenuDetailsPage {...props} disabled={true} menu={undefined} />
);

export const FormErrors = () => (
  <MenuDetailsPage
    {...props}
    errors={["name"].map(field => ({
      __typename: "MenuError",
      code: MenuErrorCode.INVALID,
      field,
      message: "Invalid field",
    }))}
  />
);
