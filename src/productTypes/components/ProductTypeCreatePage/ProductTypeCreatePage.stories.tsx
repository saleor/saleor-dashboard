// @ts-strict-ignore
import { ProductTypeKindEnum, WeightUnitsEnum } from "@dashboard/graphql";
import Decorator from "@dashboard/storybook/Decorator";
import { formError } from "@dashboard/storybook/formError";
import { taxClasses } from "@dashboard/taxes/fixtures";
import { storiesOf } from "@storybook/react";
import React from "react";

import ProductTypeCreatePage, {
  ProductTypeCreatePageProps,
  ProductTypeForm,
} from "./ProductTypeCreatePage";

const props: Omit<ProductTypeCreatePageProps, "classes"> = {
  defaultWeightUnit: "kg" as WeightUnitsEnum,
  disabled: false,
  errors: [],
  onSubmit: () => undefined,
  pageTitle: "Create product type",
  saveButtonBarState: "default",
  taxClasses,
  onFetchMoreTaxClasses: undefined,
  kind: ProductTypeKindEnum.NORMAL,
  onChangeKind: () => undefined,
};

storiesOf("Product types / Create product type", module)
  .addDecorator(Decorator)
  .add("default", () => <ProductTypeCreatePage {...props} />)
  .add("loading", () => (
    <ProductTypeCreatePage {...props} disabled={true} pageTitle={undefined} />
  ))
  .add("form errors", () => (
    <ProductTypeCreatePage
      {...props}
      errors={(["name"] as Array<keyof ProductTypeForm>).map(formError)}
    />
  ));
