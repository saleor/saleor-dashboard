import { listActionsProps } from "@dashboard/fixtures";
import { WeightUnitsEnum } from "@dashboard/graphql";
import Decorator from "@dashboard/storybook/Decorator";
import { formError } from "@dashboard/storybook/formError";
import { taxClasses } from "@dashboard/taxes/fixtures";
import { storiesOf } from "@storybook/react";
import React from "react";

import { productType } from "../../fixtures";
import ProductTypeDetailsPage, {
  ProductTypeDetailsPageProps,
  ProductTypeForm,
} from "./ProductTypeDetailsPage";

const props: Omit<ProductTypeDetailsPageProps, "classes"> = {
  defaultWeightUnit: "kg" as WeightUnitsEnum,
  disabled: false,
  errors: [],
  onAttributeAdd: () => undefined,
  onAttributeReorder: () => undefined,
  onAttributeUnassign: () => undefined,
  onDelete: () => undefined,
  onHasVariantsToggle: () => undefined,
  onSubmit: () => undefined,
  pageTitle: productType.name,
  productAttributeList: listActionsProps,
  productType,
  saveButtonBarState: "default",
  taxClasses,
  onFetchMoreTaxClasses: undefined,
  variantAttributeList: listActionsProps,
  setSelectedVariantAttributes: () => undefined,
  selectedVariantAttributes: [],
};

storiesOf("Product types / Product type details", module)
  .addDecorator(Decorator)
  .add("default", () => <ProductTypeDetailsPage {...props} />)
  .add("loading", () => (
    <ProductTypeDetailsPage
      {...props}
      disabled={true}
      pageTitle={undefined}
      productType={undefined}
    />
  ))
  .add("no attributes", () => (
    <ProductTypeDetailsPage
      {...props}
      productType={{
        ...productType,
        productAttributes: [],
      }}
    />
  ))
  .add("form errors", () => (
    <ProductTypeDetailsPage
      {...props}
      errors={(["name"] as Array<keyof ProductTypeForm>).map(formError)}
    />
  ));
