import { StockInput } from "@saleor/types/globalTypes";
import {
  add,
  remove,
  removeAtIndex,
  toggle,
  update,
  updateAtIndex
} from "@saleor/utils/lists";

import { createVariants } from "./createVariants";
import {
  ProductVariantCreateFormData,
  VariantCreatorPricesAndSkuMode
} from "./form";

export enum ProductVariantCreateReducerActionType {
  applyPriceToAll,
  applyPriceToAttribute,
  applyStockToAll,
  applyStockToAttribute,
  changeApplyPriceToAllValue,
  changeApplyPriceToAttributeId,
  changeApplyStockToAllValue,
  changeApplyStockToAttributeId,
  changeAttributeValuePrice,
  changeAttributeValueStock,
  changeVariantData,
  changeVariantStockData,
  changeWarehouses,
  chooseAttributes,
  deleteVariant,
  reload,
  selectValue
}
export type VariantField = "price" | "sku";
export interface ProductVariantCreateReducerAction {
  applyPriceOrStockToAll?: {
    mode: VariantCreatorPricesAndSkuMode;
  };
  changeApplyPriceToAllValue?: {
    price: string;
  };
  changeApplyPriceOrStockToAttributeId?: {
    attributeId: string;
  };
  changeApplyStockToAllValue?: Record<"quantity" | "warehouseIndex", number>;
  changeAttributeValuePrice?: Record<"valueId" | "price", string>;
  changeAttributeValueStock?: {
    valueId: string;
    quantity: number;
    warehouseIndex: number;
  };
  changeVariantData?: {
    field: VariantField;
    value: string;
    variantIndex: number;
  };
  changeVariantStockData?: {
    stock: StockInput;
    variantIndex: number;
  };
  changeWarehouses?: {
    warehouseId: string;
  };
  chooseAttributes?: {
    selected: string[];
  };
  deleteVariant?: {
    variantIndex: number;
  };
  reload?: {
    data?: ProductVariantCreateFormData;
  };
  selectValue?: Record<"attributeId" | "valueId", string>;
  type: ProductVariantCreateReducerActionType;
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

function chooseAttributes(
  prevState: ProductVariantCreateFormData,
  selected: string[]
) {
  return {
    ...prevState,
    attributes: prevState.attributes
      .filter(item => selected.find(id => id === item.id))
      .map(attribute => ({
        id: attribute.id,
        values: []
      }))
  };
}

function applyPriceToAll(
  state: ProductVariantCreateFormData,
  mode: VariantCreatorPricesAndSkuMode
): ProductVariantCreateFormData {
  return {
    ...state,
    price: {
      ...state.price,
      mode
    }
  };
}

function applyStockToAll(
  state: ProductVariantCreateFormData,
  mode: VariantCreatorPricesAndSkuMode
): ProductVariantCreateFormData {
  return {
    ...state,
    stock: {
      ...state.stock,
      mode
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
  quantity: number,
  warehouseIndex: number
): ProductVariantCreateFormData {
  const index = state.stock.values.findIndex(
    value => value.slug === attributeValueSlug
  );

  if (index === -1) {
    throw new Error(`Value with id ${attributeValueSlug} not found`);
  }

  const values = updateAtIndex(
    {
      ...state.stock.values[index],
      value: updateAtIndex(
        quantity,
        state.stock.values[index].value,
        warehouseIndex
      )
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
  const variant = {
    ...state.variants[variantIndex]
  };
  if (field === "price") {
    variant.price = value;
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
  const variant = {
    ...state.variants[variantIndex]
  };
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

function changeWarehouses(
  state: ProductVariantCreateFormData,
  warehouseId: string
): ProductVariantCreateFormData {
  const warehouses = toggle(warehouseId, state.warehouses, (a, b) => a === b);
  const added = warehouses.length > state.warehouses.length;

  if (added) {
    return {
      ...state,
      stock: {
        ...state.stock,
        value: [...state.stock.value, 0],
        values: state.stock.values.map(stockValue => ({
          ...stockValue,
          value: [...stockValue.value, 0]
        }))
      },
      warehouses
    };
  }

  const warehouseIndex = state.warehouses.indexOf(warehouseId);

  return {
    ...state,
    stock: {
      ...state.stock,
      value: removeAtIndex(state.stock.value, warehouseIndex),
      values: state.stock.values.map(stockValue => ({
        ...stockValue,
        value: removeAtIndex(stockValue.value, warehouseIndex)
      }))
    },
    warehouses
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
    case ProductVariantCreateReducerActionType.chooseAttributes:
      return chooseAttributes(prevState, action.chooseAttributes.selected);
    case ProductVariantCreateReducerActionType.selectValue:
      return selectValue(
        prevState,
        action.selectValue.attributeId,
        action.selectValue.valueId
      );
    case ProductVariantCreateReducerActionType.applyPriceToAll:
      return applyPriceToAll(prevState, action.applyPriceOrStockToAll.mode);
    case ProductVariantCreateReducerActionType.applyStockToAll:
      return applyStockToAll(prevState, action.applyPriceOrStockToAll.mode);
    case ProductVariantCreateReducerActionType.changeAttributeValuePrice:
      return changeAttributeValuePrice(
        prevState,
        action.changeAttributeValuePrice.valueId,
        action.changeAttributeValuePrice.price
      );
    case ProductVariantCreateReducerActionType.changeAttributeValueStock:
      return changeAttributeValueStock(
        prevState,
        action.changeAttributeValueStock.valueId,
        action.changeAttributeValueStock.quantity,
        action.changeAttributeValueStock.warehouseIndex
      );
    case ProductVariantCreateReducerActionType.changeApplyPriceToAttributeId:
      return changeApplyPriceToAttributeId(
        prevState,
        action.changeApplyPriceOrStockToAttributeId.attributeId
      );
    case ProductVariantCreateReducerActionType.changeApplyStockToAttributeId:
      return changeApplyStockToAttributeId(
        prevState,
        action.changeApplyPriceOrStockToAttributeId.attributeId
      );
    case ProductVariantCreateReducerActionType.changeApplyPriceToAllValue:
      return changeApplyPriceToAllValue(
        prevState,
        action.changeApplyPriceToAllValue.price
      );
    case ProductVariantCreateReducerActionType.changeApplyStockToAllValue:
      return changeApplyStockToAllValue(
        prevState,
        action.changeApplyStockToAllValue.warehouseIndex,
        action.changeApplyStockToAllValue.quantity
      );
    case ProductVariantCreateReducerActionType.changeVariantData:
      return changeVariantData(
        prevState,
        action.changeVariantData.field,
        action.changeVariantData.value,
        action.changeVariantData.variantIndex
      );
    case ProductVariantCreateReducerActionType.changeVariantStockData:
      return changeVariantStockData(
        prevState,
        action.changeVariantStockData.stock,
        action.changeVariantStockData.variantIndex
      );
    case ProductVariantCreateReducerActionType.changeWarehouses:
      return changeWarehouses(prevState, action.changeWarehouses.warehouseId);
    case ProductVariantCreateReducerActionType.deleteVariant:
      return deleteVariant(prevState, action.deleteVariant.variantIndex);
    case ProductVariantCreateReducerActionType.reload:
      return action.reload?.data || createVariantMatrix(prevState);
    default:
      return prevState;
  }
}

export default reduceProductVariantCreateFormData;
