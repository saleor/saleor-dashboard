import {
  add,
  remove,
  removeAtIndex,
  toggle,
  updateAtIndex,
  update
} from "@saleor/utils/lists";
import { StockInput } from "@saleor/types/globalTypes";
import { createVariants } from "./createVariants";
import { ProductVariantCreateFormData } from "./form";

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
  | "changeVariantStockData"
  | "deleteVariant"
  | "reload"
  | "selectValue";

export type VariantField = "price" | "sku";
export interface ProductVariantCreateReducerAction {
  all?: boolean;
  attributeId?: string;
  data?: ProductVariantCreateFormData;
  field?: VariantField;
  quantity?: number;
  stock?: StockInput;
  type: ProductVariantCreateReducerActionType;
  value?: string;
  valueId?: string;
  variantIndex?: number;
  warehouseIndex?: number;
}

function selectValue(
  prevState: ProductVariantCreateFormData,
  attributeId: string,
  valueSlug: string
): ProductVariantCreateFormData {
  const attribute = prevState.attributes.find(
    attribute => attribute.id === attributeId
  );
  const values = toggle(valueSlug, attribute.values, (a, b) => a === b);
  const updatedAttributes = add(
    {
      id: attributeId,
      values
    },
    remove(attribute, prevState.attributes, (a, b) => a.id === b.id)
  );

  const priceValues =
    prevState.price.attribute === attributeId
      ? toggle(
          {
            slug: valueSlug,
            value: ""
          },
          prevState.price.values,
          (a, b) => a.slug === b.slug
        )
      : prevState.price.values;

  const stockValues =
    prevState.stock.attribute === attributeId
      ? toggle(
          {
            slug: valueSlug,
            value: []
          },
          prevState.stock.values,
          (a, b) => a.slug === b.slug
        )
      : prevState.stock.values;

  return {
    ...prevState,
    attributes: updatedAttributes,
    price: {
      ...prevState.price,
      values: priceValues
    },
    stock: {
      ...prevState.stock,
      values: stockValues
    }
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

  return {
    ...state,
    price: {
      ...state.price,
      values
    }
  };
}

function changeAttributeValueStock(
  state: ProductVariantCreateFormData,
  attributeValueSlug: string,
  warehouseIndex: number,
  quantity: number
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
      value: updateAtIndex(quantity, state.stock.value, warehouseIndex)
    },
    state.stock.values,
    index
  );

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
  attributeId: string
): ProductVariantCreateFormData {
  const attribute = state.attributes.find(
    attribute => attribute.id === attributeId
  );
  const values = attribute.values.map(slug => ({
    slug,
    value: ""
  }));

  return {
    ...state,
    price: {
      ...state.price,
      attribute: attributeId,
      values
    }
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
    value: []
  }));

  return {
    ...state,
    stock: {
      ...state.stock,
      attribute: attributeId,
      values
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
  warehouseIndex: number,
  quantity: number
): ProductVariantCreateFormData {
  return {
    ...state,
    stock: {
      ...state.stock,
      value: updateAtIndex(quantity, state.stock.value, warehouseIndex)
    }
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
  }

  return {
    ...state,
    variants: updateAtIndex(variant, state.variants, variantIndex)
  };
}

function changeVariantStockData(
  state: ProductVariantCreateFormData,
  stock: StockInput,
  variantIndex: number
): ProductVariantCreateFormData {
  const variant = state.variants[variantIndex];
  variant.stocks = update(
    stock,
    variant.stocks,
    (a, b) => a.warehouse === b.warehouse
  );

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

function createVariantMatrix(
  state: ProductVariantCreateFormData
): ProductVariantCreateFormData {
  return {
    ...state,
    variants: createVariants(state)
  };
}

function reduceProductVariantCreateFormData(
  prevState: ProductVariantCreateFormData,
  action: ProductVariantCreateReducerAction
) {
  switch (action.type) {
    case "selectValue":
      return selectValue(prevState, action.attributeId, action.valueId);
    case "applyPriceToAll":
      return applyPriceToAll(prevState, action.all);
    case "applyStockToAll":
      return applyStockToAll(prevState, action.all);
    case "changeAttributeValuePrice":
      return changeAttributeValuePrice(prevState, action.valueId, action.value);
    case "changeAttributeValueStock":
      return changeAttributeValueStock(
        prevState,
        action.valueId,
        action.quantity,
        action.warehouseIndex
      );
    case "changeApplyPriceToAttributeId":
      return changeApplyPriceToAttributeId(prevState, action.attributeId);
    case "changeApplyStockToAttributeId":
      return changeApplyStockToAttributeId(prevState, action.attributeId);
    case "changeApplyPriceToAllValue":
      return changeApplyPriceToAllValue(prevState, action.value);
    case "changeApplyStockToAllValue":
      return changeApplyStockToAllValue(
        prevState,
        action.quantity,
        action.warehouseIndex
      );
    case "changeVariantData":
      return changeVariantData(
        prevState,
        action.field,
        action.value,
        action.variantIndex
      );
    case "changeVariantStockData":
      return changeVariantStockData(
        prevState,
        action.stock,
        action.variantIndex
      );
    case "deleteVariant":
      return deleteVariant(prevState, action.variantIndex);
    case "reload":
      return action.data ? action.data : createVariantMatrix(prevState);
    default:
      return prevState;
  }
}

export default reduceProductVariantCreateFormData;
