import { add, remove, toggle, updateAtIndex } from "@saleor/utils/lists";
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
  | "selectAttribute"
  | "selectValue";
export interface ProductVariantCreateReducerAction {
  all?: boolean;
  attributeId?: string;
  type: ProductVariantCreateReducerActionType;
  value?: string;
  valueId?: string;
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
  attributeValueId: string,
  price: string
): ProductVariantCreateFormData {
  const index = state.price.values.findIndex(
    value => value.id === attributeValueId
  );

  if (index === -1) {
    throw new Error(`Value with id ${attributeValueId} not found`);
  }

  const values = updateAtIndex(
    {
      id: attributeValueId,
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
  attributeValueId: string,
  stock: string
): ProductVariantCreateFormData {
  const index = state.stock.values.findIndex(
    value => value.id === attributeValueId
  );

  if (index === -1) {
    throw new Error(`Value with id ${attributeValueId} not found`);
  }

  const values = updateAtIndex(
    {
      id: attributeValueId,
      value: stock
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
  const values = attribute.values.map(id => ({
    id,
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
  attribute: string
): ProductVariantCreateFormData {
  return {
    ...state,
    stock: {
      ...state.stock,
      attribute,
      values: state.attributes
        .find(stateAttribute => stateAttribute.id === attribute)
        .values.map(attributeValue => ({
          id: attributeValue,
          value: ""
        }))
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
    default:
      return prevState;
  }
}

export default reduceProductVariantCreateFormData;
