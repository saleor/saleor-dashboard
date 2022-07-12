import { listActionsProps } from "@saleor/fixtures";
import { WeightUnitsEnum } from "@saleor/graphql";
import { formError } from "@saleor/storybook/misc";
import { storiesOf } from "@storybook/react";
import React from "react";

import ProductTypeDetailsPage, {
  ProductTypeDetailsPageProps,
  ProductTypeForm,
} from "../../../productTypes/components/ProductTypeDetailsPage";
import { productType } from "../../../productTypes/fixtures";
import Decorator from "../../Decorator";

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
  taxTypes: [],
  variantAttributeList: listActionsProps,
  setSelectedVariantAttributes: () => undefined,
  selectedVariantAttributes: [],
};

storiesOf("Views / Product types / Product type details", module)
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
