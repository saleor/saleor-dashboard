import { createVariants } from "./createVariants";
import {
  AllOrAttribute,
  createInitialForm,
  ProductVariantCreateFormData
} from "./form";

export const attributes = [
  {
    id: "attr-1",
    values: Array(9)
      .fill(0)
      .map((_, index) => `val-1-${index + 1}`)
  },
  {
    id: "attr-2",
    values: Array(6)
      .fill(0)
      .map((_, index) => `val-2-${index + 1}`)
  },
  {
    id: "attr-3",
    values: Array(4)
      .fill(0)
      .map((_, index) => `val-3-${index + 1}`)
  },
  {
    id: "attr-4",
    values: Array(11)
      .fill(0)
      .map((_, index) => `val-4-${index + 1}`)
  }
];

export const secondStep: ProductVariantCreateFormData = {
  ...createInitialForm([], "10.99"),
  attributes: [
    {
      id: attributes[0].id,
      values: []
    },
    {
      id: attributes[1].id,
      values: []
    },
    {
      id: attributes[3].id,
      values: []
    }
  ]
};

export const thirdStep: ProductVariantCreateFormData = {
  ...secondStep,
  attributes: [
    {
      id: attributes[0].id,
      values: [0, 6].map(index => attributes[0].values[index])
    },
    {
      id: attributes[1].id,
      values: [1, 3].map(index => attributes[1].values[index])
    },
    {
      id: attributes[3].id,
      values: [0, 4].map(index => attributes[3].values[index])
    }
  ]
};

const price: AllOrAttribute = {
  all: false,
  attribute: thirdStep.attributes[1].id,
  value: "",
  values: [
    {
      slug: thirdStep.attributes[1].values[0],
      value: "24.99"
    },
    {
      slug: thirdStep.attributes[1].values[1],
      value: "26.99"
    }
  ]
};
const stock: AllOrAttribute = {
  all: false,
  attribute: thirdStep.attributes[2].id,
  value: "",
  values: [
    {
      slug: thirdStep.attributes[2].values[0],
      value: "50"
    },
    {
      slug: thirdStep.attributes[2].values[1],
      value: "35"
    }
  ]
};
export const fourthStep: ProductVariantCreateFormData = {
  ...thirdStep,
  price,
  stock,
  variants: createVariants({
    ...thirdStep,
    price,
    stock
  })
};
