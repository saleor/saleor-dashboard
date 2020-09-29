import {
  attributes,
  channels,
  fourthStep,
  secondStep,
  thirdStep,
  warehouses
} from "./fixtures";
import { ChannelPrice } from "./form";
import reducer, { ProductVariantCreateReducerActionType } from "./reducer";

function execActions<TState, TAction>(
  initialState: TState,
  reducer: (state: TState, action: TAction) => TState,
  actions: TAction[]
): TState {
  return actions.reduce((acc, action) => reducer(acc, action), initialState);
}

describe("Reducer is able to", () => {
  it("select attribute values", () => {
    const state = execActions(secondStep, reducer, [
      {
        selectValue: {
          attributeId: attributes[0].id,
          valueId: attributes[0].values[0]
        },
        type: ProductVariantCreateReducerActionType.selectValue
      },
      {
        selectValue: {
          attributeId: attributes[0].id,
          valueId: attributes[0].values[6]
        },

        type: ProductVariantCreateReducerActionType.selectValue
      },
      {
        selectValue: {
          attributeId: attributes[1].id,
          valueId: attributes[1].values[1]
        },
        type: ProductVariantCreateReducerActionType.selectValue
      },
      {
        selectValue: {
          attributeId: attributes[1].id,
          valueId: attributes[1].values[3]
        },
        type: ProductVariantCreateReducerActionType.selectValue
      },
      {
        selectValue: {
          attributeId: attributes[3].id,
          valueId: attributes[3].values[0]
        },
        type: ProductVariantCreateReducerActionType.selectValue
      },
      {
        selectValue: {
          attributeId: attributes[3].id,
          valueId: attributes[3].values[4]
        },
        type: ProductVariantCreateReducerActionType.selectValue
      }
    ]);

    expect(state.attributes[0].values).toHaveLength(2);
    expect(state.attributes[1].values).toHaveLength(2);
    expect(state.attributes[2].values).toHaveLength(2);
    expect(state).toMatchSnapshot();
  });

  it("select price for all variants", () => {
    const price = "22.99";
    const state = execActions(thirdStep, reducer, [
      {
        applyPriceOrStockToAll: {
          mode: "all"
        },
        type: ProductVariantCreateReducerActionType.applyPriceToAll
      },
      {
        changeApplyPriceToAllValue: {
          channelId: channels[0].id,
          price
        },
        type: ProductVariantCreateReducerActionType.changeApplyPriceToAllValue
      },
      {
        type: ProductVariantCreateReducerActionType.reload
      }
    ]);
    expect(state.price.mode).toBe("all");
    expect(state.price.channels[0].price).toBe(price);
    expect(state).toMatchSnapshot();
  });

  it("select warehouses in which stock will be created", () => {
    const state = execActions(thirdStep, reducer, [
      {
        changeWarehouses: {
          warehouseId: warehouses[0].id
        },
        type: ProductVariantCreateReducerActionType.changeWarehouses
      },
      {
        changeWarehouses: {
          warehouseId: warehouses[2].id
        },
        type: ProductVariantCreateReducerActionType.changeWarehouses
      }
    ]);

    expect(state.warehouses).toHaveLength(2);
    expect(state).toMatchSnapshot();
  });

  it("select stock for all variants", () => {
    const quantity = 45;
    const warehouseIndex = 1;
    const state = execActions(thirdStep, reducer, [
      {
        applyPriceOrStockToAll: {
          mode: "all"
        },
        type: ProductVariantCreateReducerActionType.applyStockToAll
      },
      {
        changeApplyStockToAllValue: {
          quantity,
          warehouseIndex
        },
        type: ProductVariantCreateReducerActionType.changeApplyStockToAllValue
      },
      {
        type: ProductVariantCreateReducerActionType.reload
      }
    ]);

    expect(state.stock.mode).toBe("all");
    expect(state.stock.value[warehouseIndex]).toBe(quantity);
    expect(state).toMatchSnapshot();
  });

  it("select price to each attribute value", () => {
    const attribute = thirdStep.attributes[0];
    const value = 45.99;
    const state = execActions(thirdStep, reducer, [
      {
        applyPriceOrStockToAll: {
          mode: "attribute"
        },
        type: ProductVariantCreateReducerActionType.applyPriceToAll
      },
      {
        changeApplyPriceOrStockToAttributeId: {
          attributeId: attribute.id
        },
        type:
          ProductVariantCreateReducerActionType.changeApplyPriceToAttributeId
      },
      {
        changeAttributeValuePrice: {
          channelId: channels[0].id,
          price: value.toString(),
          valueId: attribute.values[0]
        },
        type: ProductVariantCreateReducerActionType.changeAttributeValuePrice
      },
      {
        changeAttributeValuePrice: {
          channelId: channels[1].id,
          price: (value + 6).toString(),
          valueId: attribute.values[1]
        },
        type: ProductVariantCreateReducerActionType.changeAttributeValuePrice
      },
      {
        type: ProductVariantCreateReducerActionType.reload
      }
    ]);

    expect(state.price.mode).toBe("attribute");
    expect(state.price.values).toHaveLength(
      state.attributes.find(attribute => state.price.attribute === attribute.id)
        .values.length
    );
    expect(state).toMatchSnapshot();
  });

  it("select stock to each attribute value", () => {
    const attribute = thirdStep.attributes[0];
    const quantity = 13;
    const state = execActions(thirdStep, reducer, [
      {
        applyPriceOrStockToAll: {
          mode: "attribute"
        },
        type: ProductVariantCreateReducerActionType.applyStockToAll
      },
      {
        changeApplyPriceOrStockToAttributeId: {
          attributeId: attribute.id
        },
        type:
          ProductVariantCreateReducerActionType.changeApplyStockToAttributeId
      },
      {
        changeAttributeValueStock: {
          quantity,
          valueId: attribute.values[0],
          warehouseIndex: 0
        },
        type: ProductVariantCreateReducerActionType.changeAttributeValueStock
      },
      {
        changeAttributeValueStock: {
          quantity: quantity + 6,
          valueId: attribute.values[1],
          warehouseIndex: 0
        },
        type: ProductVariantCreateReducerActionType.changeAttributeValueStock
      },
      {
        type: ProductVariantCreateReducerActionType.reload
      }
    ]);

    expect(state.stock.mode).toBe("attribute");
    expect(state.stock.values).toHaveLength(
      state.attributes.find(attribute => state.stock.attribute === attribute.id)
        .values.length
    );
    expect(state).toMatchSnapshot();
  });

  it("modify individual variant price", () => {
    const value: ChannelPrice = { channelId: channels[0].id, price: "7" };
    const variantIndex = 3;

    const state = execActions(fourthStep, reducer, [
      {
        changeVariantPriceData: {
          value,
          variantIndex
        },
        type: ProductVariantCreateReducerActionType.changeVariantPriceData
      }
    ]);

    expect(state.variants[variantIndex].channelListings[0].price).toBe(
      value.price
    );
    expect(state.variants[variantIndex - 1].channelListings).toBe(
      fourthStep.variants[variantIndex - 1].channelListings
    );
    expect(state).toMatchSnapshot();
  });

  it("modify individual variant stock", () => {
    const quantity = 5;
    const variantIndex = 3;

    const state = execActions(fourthStep, reducer, [
      {
        changeVariantStockData: {
          stock: {
            quantity,
            warehouse: warehouses[0].id
          },
          variantIndex
        },
        type: ProductVariantCreateReducerActionType.changeVariantStockData
      }
    ]);

    expect(state.variants[variantIndex].stocks[0].quantity).toBe(quantity);
    expect(state.variants[variantIndex - 1].stocks[0].quantity).toBe(
      fourthStep.variants[variantIndex - 1].stocks[0].quantity
    );
    expect(state).toMatchSnapshot();
  });

  it("delete variant", () => {
    const variantIndex = 3;

    const state = execActions(fourthStep, reducer, [
      {
        deleteVariant: {
          variantIndex
        },
        type: ProductVariantCreateReducerActionType.deleteVariant
      }
    ]);

    expect(state.variants.length).toBe(fourthStep.variants.length - 1);
  });
});
