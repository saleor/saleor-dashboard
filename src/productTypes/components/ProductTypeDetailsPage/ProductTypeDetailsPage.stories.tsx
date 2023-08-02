// @ts-strict-ignore
import { listActionsProps } from "@dashboard/fixtures";
import { WeightUnitsEnum } from "@dashboard/graphql";
import { taxClasses } from "@dashboard/taxes/fixtures";
import React from "react";

import { formError } from "../../../../.storybook/helpers";
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

export default {
  title: "Product types / Product type details",
};

export const Default = () => <ProductTypeDetailsPage {...props} />;

export const Loading = () => (
  <ProductTypeDetailsPage
    {...props}
    disabled={true}
    pageTitle={undefined}
    productType={undefined}
  />
);

export const NoAttributes = () => (
  <ProductTypeDetailsPage
    {...props}
    productType={{
      ...productType,
      productAttributes: [],
    }}
  />
);

export const FormErrors = () => (
  <ProductTypeDetailsPage
    {...props}
    errors={(["name"] as Array<keyof ProductTypeForm>).map(formError)}
  />
);
