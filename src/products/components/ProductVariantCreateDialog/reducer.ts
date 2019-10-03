import {
  add,
  remove,
  removeAtIndex,
  toggle,
  updateAtIndex
} from "@saleor/utils/lists";
import { createVariants } from "./createVariants";
import { initialForm, ProductVariantCreateFormData } from "./form";

export type ProductVariantCreateReducerActionType =
  | "applyPriceToAll"
  | "applyPriceToAttribute"
  | "applyStockToAll"
  | "applyStockToAttribute"
  | "changeApplyPriceToAllValue"
  | "changeApplyPriceToAttributeId"
  | "changeApplyStockToAllValue"
  | "changeApplyStockToAttributeId"
  | "changeAttributeValuePrice"
  | "changeAttributeValueStock"
  | "changeVariantData"
  | "deleteVariant"
  | "selectAttribute"
  | "selectValue";

export type VariantField = "stock" | "price" | "sku";
export interface ProductVariantCreateReducerAction {
  all?: boolean;
  attributeId?: string;
  field?: VariantField;
  type: ProductVariantCreateReducerActionType;
  value?: string;
  valueId?: string;
  variantIndex?: number;
}

function selectAttribute(
  state: ProductVariantCreateFormData,
  attributeId: string
): ProductVariantCreateFormData {
  const attributes = toggle(
    {
      id: attributeId,
      values: []
    },
    state.attributes,
    (a, b) => a.id === b.id
  );

  return {
    ...initialForm,
    attributes
  };
}

function selectValue(
  state: ProductVariantCreateFormData,
  attributeId: string,
  valueId: string
): ProductVariantCreateFormData {
  const attribute = state.attributes.find(
    attribute => attribute.id === attributeId
  );
  const values = toggle(valueId, attribute.values, (a, b) => a === b);
  const updatedAttributes = add(
    {
      id: attributeId,
      values
    },
    remove(attribute, state.attributes, (a, b) => a.id === b.id)
  );

  return {
    ...initialForm,
    attributes: updatedAttributes
  };
}

function applyPriceToAll(
  state: ProductVariantCreateFormData,
  value: boolean
): ProductVariantCreateFormData {
  const data = {
    ...state,
    price: {
      ...state.price,
      all: value
    }
  };

  return {
    ...data,
    variants: createVariants(data)
  };
}

function applyStockToAll(
  state: ProductVariantCreateFormData,
  value: boolean
): ProductVariantCreateFormData {
  const data = {
    ...state,
    stock: {
      ...state.stock,
      all: value
    }
  };

  return {
    ...data,
    variants: createVariants(data)
  };
}

function changeAttributeValuePrice(
  state: ProductVariantCreateFormData,
  attributeValueSlug: string,
  price: string
): ProductVariantCreateFormData {
  const index = state.price.values.findIndex(
    value => value.slug === attributeValueSlug
  );

  if (index === -1) {
    throw new Error(`Value with id ${attributeValueSlug} not found`);
  }

  const values = updateAtIndex(
    {
      slug: attributeValueSlug,
      value: price
    },
    state.price.values,
    index
  );

  const data = {
    ...state,
    price: {
      ...state.price,
      values
    }
  };

  return {
    ...data,
    variants: createVariants(data)
  };
}

function changeAttributeValueStock(
  state: ProductVariantCreateFormData,
  attributeValueSlug: string,
  stock: string
): ProductVariantCreateFormData {
  const index = state.stock.values.findIndex(
    value => value.slug === attributeValueSlug
  );

  if (index === -1) {
    throw new Error(`Value with id ${attributeValueSlug} not found`);
  }

  const values = updateAtIndex(
    {
      slug: attributeValueSlug,
      value: stock
    },
    state.stock.values,
    index
  );

  const data = {
    ...state,
    stock: {
      ...state.stock,
      values
    }
  };

  return {
    ...data,
    variants: createVariants(data)
  };
}

function changeApplyPriceToAttributeId(
  state: ProductVariantCreateFormData,
  attributeId: string
): ProductVariantCreateFormData {
  const attribute = state.attributes.find(
    attribute => attribute.id === attributeId
  );
  const values = attribute.values.map(slug => ({
    slug,
    value: ""
  }));
  const data = {
    ...state,
    price: {
      ...state.price,
      attribute: attributeId,
      values
    }
  };

  return {
    ...data,
    variants: createVariants(data)
  };
}

function changeApplyStockToAttributeId(
  state: ProductVariantCreateFormData,
  attributeId: string
): ProductVariantCreateFormData {
  const attribute = state.attributes.find(
    attribute => attribute.id === attributeId
  );
  const values = attribute.values.map(slug => ({
    slug,
    value: ""
  }));

  const data = {
    ...state,
    stock: {
      ...state.stock,
      attribute: attributeId,
      values
    }
  };

  return {
    ...data,
    variants: createVariants(data)
  };
}

function changeApplyPriceToAllValue(
  state: ProductVariantCreateFormData,
  value: string
): ProductVariantCreateFormData {
  const data = {
    ...state,
    price: {
      ...state.price,
      value
    }
  };

  return {
    ...data,
    variants: createVariants(data)
  };
}

function changeApplyStockToAllValue(
  state: ProductVariantCreateFormData,
  value: string
): ProductVariantCreateFormData {
  const data = {
    ...state,
    stock: {
      ...state.stock,
      value
    }
  };

  return {
    ...data,
    variants: createVariants(data)
  };
}

function changeVariantData(
  state: ProductVariantCreateFormData,
  field: VariantField,
  value: string,
  variantIndex: number
): ProductVariantCreateFormData {
  const variant = state.variants[variantIndex];
  if (field === "price") {
    variant.priceOverride = value;
  } else if (field === "sku") {
    variant.sku = value;
  } else {
    variant.quantity = parseInt(value, 10);
  }

  return {
    ...state,
    variants: updateAtIndex(variant, state.variants, variantIndex)
  };
}

function deleteVariant(
  state: ProductVariantCreateFormData,
  variantIndex: number
): ProductVariantCreateFormData {
  return {
    ...state,
    variants: removeAtIndex(state.variants, variantIndex)
  };
}

function reduceProductVariantCreateFormData(
  prevState: ProductVariantCreateFormData,
  action: ProductVariantCreateReducerAction
) {
  switch (action.type) {
    case "selectAttribute":
      return selectAttribute(prevState, action.attributeId);

    case "selectValue":
      return selectValue(prevState, action.attributeId, action.valueId);

    case "applyPriceToAll":
      return applyPriceToAll(prevState, action.all);
    case "applyStockToAll":
      return applyStockToAll(prevState, action.all);
    case "changeAttributeValuePrice":
      return changeAttributeValuePrice(prevState, action.valueId, action.value);
    case "changeAttributeValueStock":
      return changeAttributeValueStock(prevState, action.valueId, action.value);
    case "changeApplyPriceToAttributeId":
      return changeApplyPriceToAttributeId(prevState, action.attributeId);
    case "changeApplyStockToAttributeId":
      return changeApplyStockToAttributeId(prevState, action.attributeId);
    case "changeApplyPriceToAllValue":
      return changeApplyPriceToAllValue(prevState, action.value);
    case "changeApplyStockToAllValue":
      return changeApplyStockToAllValue(prevState, action.value);
    case "changeVariantData":
      return changeVariantData(
        prevState,
        action.field,
        action.value,
        action.variantIndex
      );
    case "deleteVariant":
      return deleteVariant(prevState, action.variantIndex);
    default:
      return prevState;
  }
}

export default reduceProductVariantCreateFormData;
