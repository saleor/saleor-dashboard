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
  changeVariantSku,
  changeVariantPriceData,
  changeVariantStockData,
  changeWarehouses,
  deleteVariant,
  reload,
  selectValue
}
export interface ProductVariantCreateReducerAction {
  applyPriceOrStockToAll?: {
    mode: VariantCreatorPricesAndSkuMode;
  };
  changeApplyPriceToAllValue?: {
    channelId: string;
    price: string;
  };
  changeApplyPriceOrStockToAttributeId?: {
    attributeId: string;
  };
  changeApplyStockToAllValue?: Record<"quantity" | "warehouseIndex", number>;
  changeAttributeValuePrice?: Record<"valueId" | "price" | "channelId", string>;
  changeAttributeValueStock?: {
    valueId: string;
    quantity: number;
    warehouseIndex: number;
  };
  changeVariantSku?: {
    value: string;
    variantIndex: number;
  };
  changeVariantPriceData?: {
    value: { channelId: string; price: string };
    variantIndex: number;
  };
  changeVariantStockData?: {
    stock: StockInput;
    variantIndex: number;
  };
  changeWarehouses?: {
    warehouseId: string;
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
            value: []
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
  price: string,
  channelId: string
): ProductVariantCreateFormData {
  const index = state.price.values.findIndex(
    value => value.slug === attributeValueSlug
  );

  if (index === -1) {
    throw new Error(`Value with id ${attributeValueSlug} not found`);
  }

  const channels = state.price.values[index].value;
  const channelIndex = channels.findIndex(
    channel => channel.channelId === channelId
  );

  const values = updateAtIndex(
    {
      slug: attributeValueSlug,
      value: updateAtIndex({ channelId, price }, channels, channelIndex)
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
    value: []
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
  channelId: string,
  price: string
): ProductVariantCreateFormData {
  const prevChannels = [...state.price.channels];
  const channelIndex = prevChannels?.findIndex(
    channel => channelId === channel.channelId
  );
  prevChannels[channelIndex] = { channelId, price };
  return {
    ...state,
    price: {
      ...state.price,
      channels: prevChannels
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

function changeVariantSku(
  state: ProductVariantCreateFormData,
  value: string,
  variantIndex: number
): ProductVariantCreateFormData {
  const variant = {
    ...state.variants[variantIndex]
  };
  variant.sku = value;

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

function changeVariantPriceData(
  state: ProductVariantCreateFormData,
  value: { channelId: string; price: string },
  variantIndex: number
): ProductVariantCreateFormData {
  const { channelId, price } = value;
  const variant = {
    ...state.variants[variantIndex]
  };
  const channelIndex = variant.channelListings.findIndex(
    listing => listing.channelId === channelId
  );
  const updatedVariant = {
    ...variant,
    channelListings: updateAtIndex(
      { channelId, price },
      [...variant.channelListings],
      channelIndex
    )
  };
  return {
    ...state,
    variants: updateAtIndex(updatedVariant, [...state.variants], variantIndex)
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
        action.changeAttributeValuePrice.price,
        action.changeAttributeValuePrice.channelId
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
        action.changeApplyPriceToAllValue.channelId,
        action.changeApplyPriceToAllValue.price
      );
    case ProductVariantCreateReducerActionType.changeApplyStockToAllValue:
      return changeApplyStockToAllValue(
        prevState,
        action.changeApplyStockToAllValue.warehouseIndex,
        action.changeApplyStockToAllValue.quantity
      );
    case ProductVariantCreateReducerActionType.changeVariantSku:
      return changeVariantSku(
        prevState,
        action.changeVariantSku.value,
        action.changeVariantSku.variantIndex
      );
    case ProductVariantCreateReducerActionType.changeVariantPriceData:
      return changeVariantPriceData(
        prevState,
        action.changeVariantPriceData.value,
        action.changeVariantPriceData.variantIndex
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
