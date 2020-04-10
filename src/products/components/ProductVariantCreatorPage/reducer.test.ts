import {
  attributes,
  fourthStep,
  secondStep,
  thirdStep,
  warehouses
} from "./fixtures";
import reducer, {
  VariantField,
  ProductVariantCreateReducerActionType
} from "./reducer";

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
    const price = "45.99";
    const state = execActions(thirdStep, reducer, [
      {
        applyPriceOrStockToAll: {
          all: true
        },
        type: ProductVariantCreateReducerActionType.applyPriceToAll
      },
      {
        changeApplyPriceToAllValue: {
          price
        },
        type: ProductVariantCreateReducerActionType.changeApplyPriceToAllValue
      },
      {
        type: ProductVariantCreateReducerActionType.reload
      }
    ]);

    expect(state.price.all).toBeTruthy();
    expect(state.price.value).toBe(price);
    expect(state).toMatchSnapshot();
  });

  it("select stock for all variants", () => {
    const quantity = 45;
    const warehouseIndex = 1;
    const state = execActions(thirdStep, reducer, [
      {
        applyPriceOrStockToAll: {
          all: true
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

    expect(state.stock.all).toBeTruthy();
    expect(state.stock.value[warehouseIndex]).toBe(quantity);
    expect(state).toMatchSnapshot();
  });

  it("select price to each attribute value", () => {
    const attribute = thirdStep.attributes[0];
    const value = 45.99;
    const state = execActions(thirdStep, reducer, [
      {
        applyPriceOrStockToAll: {
          all: false
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
          price: value.toString(),
          valueId: attribute.values[0]
        },
        type: ProductVariantCreateReducerActionType.changeAttributeValuePrice
      },
      {
        changeAttributeValuePrice: {
          price: (value + 6).toString(),
          valueId: attribute.values[1]
        },
        type: ProductVariantCreateReducerActionType.changeAttributeValuePrice
      },
      {
        type: ProductVariantCreateReducerActionType.reload
      }
    ]);

    expect(state.price.all).toBeFalsy();
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
          all: false
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

    expect(state.stock.all).toBeFalsy();
    expect(state.stock.values).toHaveLength(
      state.attributes.find(attribute => state.stock.attribute === attribute.id)
        .values.length
    );
    expect(state).toMatchSnapshot();
  });

  it("modify individual variant price", () => {
    const field: VariantField = "price";
    const value = "49.99";
    const variantIndex = 3;

    const state = execActions(fourthStep, reducer, [
      {
        changeVariantData: {
          field,
          value,
          variantIndex
        },
        type: ProductVariantCreateReducerActionType.changeVariantData
      }
    ]);

    expect(state.variants[variantIndex].priceOverride).toBe(value);
    expect(state.variants[variantIndex - 1].priceOverride).toBe(
      fourthStep.variants[variantIndex - 1].priceOverride
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
