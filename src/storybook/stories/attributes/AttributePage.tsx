import AttributePage, {
  AttributePageProps,
} from "@saleor/attributes/components/AttributePage";
import { attribute } from "@saleor/attributes/fixtures";
import { AttributeErrorCode, AttributeInputTypeEnum } from "@saleor/graphql";
import { storiesOf } from "@storybook/react";
import React from "react";

import Decorator from "../../Decorator";

const props: AttributePageProps = {
  children: () => null,
  attribute,
  disabled: false,
  errors: [],
  onDelete: () => undefined,
  onSubmit: () => undefined,
  onValueAdd: () => undefined,
  onValueDelete: () => undefined,
  onValueReorder: () => undefined,
  onValueUpdate: () => undefined,
  saveButtonBarState: "default",
  values: attribute.choices,
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
  },
  onNextPage: () => undefined,
  onPreviousPage: () => undefined,
};

storiesOf("Views / Attributes / Attribute details", module)
  .addDecorator(Decorator)
  .add("default", () => <AttributePage {...props}>{() => null}</AttributePage>)
  .add("loading", () => (
    <AttributePage
      {...props}
      attribute={undefined}
      disabled={true}
      values={undefined}
    >
      {() => null}
    </AttributePage>
  ))
  .add("no values", () => (
    <AttributePage {...props} values={undefined}>
      {() => null}
    </AttributePage>
  ))
  .add("form errors", () => (
    <AttributePage
      {...props}
      errors={["name", "slug", "storefrontSearchPosition"].map(field => ({
        __typename: "AttributeError",
        code: AttributeErrorCode.INVALID,
        field,
        message: "Attribute code invalid",
      }))}
    >
      {() => null}
    </AttributePage>
  ))
  .add("multiple select input", () => (
    <AttributePage
      {...props}
      attribute={{
        ...attribute,
        inputType: AttributeInputTypeEnum.MULTISELECT,
      }}
    >
      {() => null}
    </AttributePage>
  ))
  .add("create", () => (
    <AttributePage {...props} attribute={null}>
      {() => null}
    </AttributePage>
  ));
