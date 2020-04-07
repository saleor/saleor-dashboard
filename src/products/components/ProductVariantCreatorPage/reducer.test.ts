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
        attributeId: attributes[0].id,
        type: ProductVariantCreateReducerActionType.selectValue,
        valueId: attributes[0].values[0]
      },
      {
        attributeId: attributes[0].id,
        type: ProductVariantCreateReducerActionType.selectValue,
        valueId: attributes[0].values[6]
      },
      {
        attributeId: attributes[1].id,
        type: ProductVariantCreateReducerActionType.selectValue,
        valueId: attributes[1].values[1]
      },
      {
        attributeId: attributes[1].id,
        type: ProductVariantCreateReducerActionType.selectValue,
        valueId: attributes[1].values[3]
      },
      {
        attributeId: attributes[3].id,
        type: ProductVariantCreateReducerActionType.selectValue,
        valueId: attributes[3].values[0]
      },
      {
        attributeId: attributes[3].id,
        type: ProductVariantCreateReducerActionType.selectValue,
        valueId: attributes[3].values[4]
      }
    ]);

    expect(state.attributes[0].values).toHaveLength(2);
    expect(state.attributes[1].values).toHaveLength(2);
    expect(state.attributes[2].values).toHaveLength(2);
    expect(state).toMatchSnapshot();
  });

  it("select price for all variants", () => {
    const value = "45.99";
    const state = execActions(thirdStep, reducer, [
      {
        all: true,
        type: ProductVariantCreateReducerActionType.applyPriceToAll
      },
      {
        type: ProductVariantCreateReducerActionType.changeApplyPriceToAllValue,
        value
      },
      {
        type: ProductVariantCreateReducerActionType.reload
      }
    ]);

    expect(state.price.all).toBeTruthy();
    expect(state.price.value).toBe(value);
    expect(state).toMatchSnapshot();
  });

  it("select stock for all variants", () => {
    const quantity = 45.99;
    const state = execActions(thirdStep, reducer, [
      {
        all: true,
        type: ProductVariantCreateReducerActionType.applyStockToAll
      },
      {
        quantity,
        type: ProductVariantCreateReducerActionType.changeApplyStockToAllValue,
        warehouseIndex: 1
      },
      {
        type: ProductVariantCreateReducerActionType.reload
      }
    ]);

    expect(state.stock.all).toBeTruthy();
    expect(state.stock.value[1]).toBe(quantity);
    expect(state).toMatchSnapshot();
  });

  it("select price to each attribute value", () => {
    const attribute = thirdStep.attributes[0];
    const value = 45.99;
    const state = execActions(thirdStep, reducer, [
      {
        all: false,
        type: ProductVariantCreateReducerActionType.applyPriceToAll
      },
      {
        attributeId: attribute.id,
        type:
          ProductVariantCreateReducerActionType.changeApplyPriceToAttributeId
      },
      {
        type: ProductVariantCreateReducerActionType.changeAttributeValuePrice,
        value: value.toString(),
        valueId: attribute.values[0]
      },
      {
        type: ProductVariantCreateReducerActionType.changeAttributeValuePrice,
        value: (value + 6).toString(),
        valueId: attribute.values[1]
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
    const value = 13;
    const state = execActions(thirdStep, reducer, [
      {
        all: false,
        type: ProductVariantCreateReducerActionType.applyStockToAll
      },
      {
        attributeId: attribute.id,
        type:
          ProductVariantCreateReducerActionType.changeApplyStockToAttributeId
      },
      {
        type: ProductVariantCreateReducerActionType.changeAttributeValueStock,
        value: value.toString(),
        valueId: attribute.values[0]
      },
      {
        type: ProductVariantCreateReducerActionType.changeAttributeValueStock,
        value: (value + 6).toString(),
        valueId: attribute.values[1]
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
        field,
        type: ProductVariantCreateReducerActionType.changeVariantData,
        value,
        variantIndex
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
        stock: {
          quantity,
          warehouse: warehouses[0].id
        },
        type: ProductVariantCreateReducerActionType.changeVariantStockData,
        variantIndex
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
        type: ProductVariantCreateReducerActionType.deleteVariant,
        variantIndex
      }
    ]);

    expect(state.variants.length).toBe(fourthStep.variants.length - 1);
  });
});
