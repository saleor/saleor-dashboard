import { toggle, updateAtIndex } from "@saleor/utils/lists";
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
  | "changeAttributePrice"
  | "changeAttributeStock"
  | "selectAttribute"
  | "selectValue";
export interface ProductVariantCreateReducerAction {
  all?: boolean;
  id?: string;
  type: ProductVariantCreateReducerActionType;
  value?: string;
}

function selectAttribute(
  state: ProductVariantCreateFormData,
  attribute: string
): ProductVariantCreateFormData {
  const attributes = toggle(attribute, state.attributes, (a, b) => a === b);

  return {
    ...initialForm,
    attributes
  };
}

function selectValue(
  state: ProductVariantCreateFormData,
  value: string
): ProductVariantCreateFormData {
  const values = toggle(value, state.values, (a, b) => a === b);

  return {
    ...initialForm,
    attributes: state.attributes,
    values
  };
}

function applyPriceToAll(
  state: ProductVariantCreateFormData,
  value: boolean
): ProductVariantCreateFormData {
  return {
    ...state,
    price: {
      ...state.price,
      all: value
    }
  };
}

function applyStockToAll(
  state: ProductVariantCreateFormData,
  value: boolean
): ProductVariantCreateFormData {
  return {
    ...state,
    stock: {
      ...state.stock,
      all: value
    }
  };
}

function changeAttributePrice(
  state: ProductVariantCreateFormData,
  attribute: string,
  price: string
): ProductVariantCreateFormData {
  const index = state.price.values.indexOf(attribute);
  const values = updateAtIndex(price, state.price.values, index);

  return {
    ...state,
    price: {
      ...state.price,
      values
    }
  };
}

function changeAttributeStock(
  state: ProductVariantCreateFormData,
  attribute: string,
  stock: string
): ProductVariantCreateFormData {
  const index = state.stock.values.indexOf(attribute);
  const values = updateAtIndex(stock, state.stock.values, index);

  return {
    ...state,
    stock: {
      ...state.stock,
      values
    }
  };
}

function changeApplyPriceToAttributeId(
  state: ProductVariantCreateFormData,
  attribute: string
): ProductVariantCreateFormData {
  return {
    ...state,
    price: {
      ...state.price,
      attribute
    }
  };
}

function changeApplyStockToAttributeId(
  state: ProductVariantCreateFormData,
  attribute: string
): ProductVariantCreateFormData {
  return {
    ...state,
    stock: {
      ...state.stock,
      attribute
    }
  };
}

function changeApplyPriceToAllValue(
  state: ProductVariantCreateFormData,
  value: string
): ProductVariantCreateFormData {
  return {
    ...state,
    price: {
      ...state.price,
      value
    }
  };
}

function changeApplyStockToAllValue(
  state: ProductVariantCreateFormData,
  value: string
): ProductVariantCreateFormData {
  return {
    ...state,
    stock: {
      ...state.stock,
      value
    }
  };
}

function reduceProductVariantCreateFormData(
  prevState: ProductVariantCreateFormData,
  action: ProductVariantCreateReducerAction
) {
  switch (action.type) {
    case "selectAttribute":
      return selectAttribute(prevState, action.id);

    case "selectValue":
      return selectValue(prevState, action.id);

    case "applyPriceToAll":
      return applyPriceToAll(prevState, action.all);
    case "applyStockToAll":
      return applyStockToAll(prevState, action.all);
    case "changeAttributePrice":
      return changeAttributePrice(prevState, action.id, action.value);
    case "changeAttributeStock":
      return changeAttributeStock(prevState, action.id, action.value);
    case "changeApplyPriceToAttributeId":
      return changeApplyPriceToAttributeId(prevState, action.id);
    case "changeApplyStockToAttributeId":
      return changeApplyStockToAttributeId(prevState, action.id);
    case "changeApplyPriceToAllValue":
      return changeApplyPriceToAllValue(prevState, action.value);
    case "changeApplyStockToAllValue":
      return changeApplyStockToAllValue(prevState, action.value);
  }
  return prevState;
}

export default reduceProductVariantCreateFormData;
