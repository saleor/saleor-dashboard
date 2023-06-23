// @ts-strict-ignore
import { ProductTypeKindEnum, WeightUnitsEnum } from "@dashboard/graphql";
import { taxClasses } from "@dashboard/taxes/fixtures";
import React from "react";

import ProductTypeCreatePage, {
  ProductTypeCreatePageProps,
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

export default {
  title: "Product types / Create product type",
};

export const Default = () => <ProductTypeCreatePage {...props} />;

export const Loading = () => (
  <ProductTypeCreatePage {...props} disabled={true} pageTitle={undefined} />
);
