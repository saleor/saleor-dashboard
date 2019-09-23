import { ProductVariantCreateInput } from "../../../types/globalTypes";

export interface AttributeValue {
  id: string;
  value: string;
}
export interface AllOrAttribute {
  all: boolean;
  attribute: string;
  value: string;
  values: AttributeValue[];
}
export interface Attribute {
  id: string;
  values: string[];
}
export interface ProductVariantCreateFormData {
  attributes: Attribute[];
  price: AllOrAttribute;
  stock: AllOrAttribute;
  variants: ProductVariantCreateInput[];
}

export const initialForm: ProductVariantCreateFormData = {
  attributes: [],
  price: {
    all: true,
    attribute: undefined,
    value: "",
    values: []
  },
  stock: {
    all: true,
    attribute: undefined,
    value: "",
    values: []
  },
  variants: []
};
