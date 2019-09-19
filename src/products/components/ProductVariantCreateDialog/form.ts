import { ProductVariantCreateInput } from "../../../types/globalTypes";

export interface AllOrAttribute {
  all: boolean;
  attribute: string;
  value: string;
  values: string[];
}
export interface ProductVariantCreateFormData {
  attributes: string[];
  price: AllOrAttribute;
  stock: AllOrAttribute;
  values: string[];
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
  values: [],
  variants: []
};
