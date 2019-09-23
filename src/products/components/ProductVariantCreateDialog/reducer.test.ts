import { attributes, secondStep, thirdStep } from "./fixtures";
import { initialForm } from "./form";
import reducer from "./reducer";

function execActions<TState, TAction>(
  initialState: TState,
  reducer: (state: TState, action: TAction) => TState,
  actions: TAction[]
): TState {
  return actions.reduce((acc, action) => reducer(acc, action), initialState);
}

describe("Reducer is able to", () => {
  it("select attributes", () => {
    const state = execActions(initialForm, reducer, [
      {
        attributeId: attributes[0].id,
        type: "selectAttribute"
      },
      {
        attributeId: attributes[1].id,
        type: "selectAttribute"
      },
      {
        attributeId: attributes[3].id,
        type: "selectAttribute"
      }
    ]);

    expect(state.attributes).toHaveLength(3);
    expect(state).toMatchSnapshot();
  });

  it("select attribute values", () => {
    const state = execActions(secondStep, reducer, [
      {
        attributeId: attributes[0].id,
        type: "selectValue",
        valueId: attributes[0].values[0]
      },
      {
        attributeId: attributes[0].id,
        type: "selectValue",
        valueId: attributes[0].values[6]
      },
      {
        attributeId: attributes[1].id,
        type: "selectValue",
        valueId: attributes[1].values[1]
      },
      {
        attributeId: attributes[1].id,
        type: "selectValue",
        valueId: attributes[1].values[3]
      },
      {
        attributeId: attributes[3].id,
        type: "selectValue",
        valueId: attributes[3].values[0]
      },
      {
        attributeId: attributes[3].id,
        type: "selectValue",
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
        type: "applyPriceToAll"
      },
      {
        type: "changeApplyPriceToAllValue",
        value
      }
    ]);

    expect(state.price.all).toBeTruthy();
    expect(state.price.value).toBe(value);
    expect(state).toMatchSnapshot();
  });

  it("select stock for all variants", () => {
    const value = 45.99;
    const state = execActions(thirdStep, reducer, [
      {
        all: true,
        type: "applyStockToAll"
      },
      {
        type: "changeApplyStockToAllValue",
        value: value.toString()
      }
    ]);

    expect(state.stock.all).toBeTruthy();
    expect(state.stock.value).toBe(value.toString());
    expect(state).toMatchSnapshot();
  });

  it("select price to each attribute value", () => {
    const value = 45.99;
    const state = execActions(thirdStep, reducer, [
      {
        all: false,
        type: "applyPriceToAll"
      },
      {
        attributeId: attributes[0].id,
        type: "changeApplyPriceToAttributeId"
      },
      {
        type: "changeAttributeValuePrice",
        value: value.toString(),
        valueId: attributes[0].values[0]
      },
      {
        type: "changeAttributeValuePrice",
        value: (value + 6).toString(),
        valueId: attributes[0].values[6]
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
    const value = 13;
    const state = execActions(thirdStep, reducer, [
      {
        all: false,
        type: "applyStockToAll"
      },
      {
        attributeId: attributes[0].id,
        type: "changeApplyStockToAttributeId"
      },
      {
        type: "changeAttributeValueStock",
        value: value.toString(),
        valueId: attributes[0].values[0]
      },
      {
        type: "changeAttributeValueStock",
        value: (value + 6).toString(),
        valueId: attributes[0].values[6]
      }
    ]);

    expect(state.stock.all).toBeFalsy();
    expect(state.stock.values).toHaveLength(
      state.attributes.find(attribute => state.stock.attribute === attribute.id)
        .values.length
    );
    expect(state).toMatchSnapshot();
  });
});
