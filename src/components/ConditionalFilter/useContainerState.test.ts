import { act, renderHook } from "@testing-library/react-hooks";

import { Condition, FilterElement } from "./FilterElement";
import { ConditionOptions } from "./FilterElement/ConditionOptions";
import { ConditionSelected } from "./FilterElement/ConditionSelected";
import { ExpressionValue } from "./FilterElement/FilterElement";
import { FilterValueProvider } from "./FilterValueProvider";
import { useContainerState } from "./useContainerState";

describe("ConditionalFilter / useContainerState", () => {
  const valueProvider: FilterValueProvider = {
    loading: false,
    value: [],
    persist: () => undefined,
    isPersisted: () => true,
    getTokenByName: () => undefined,
    clear: () => undefined,
    count: 0,
  };

  it("should set initial value from value provider", () => {
    // Act
    const { result } = renderHook(() => useContainerState(valueProvider));

    // Assert
    expect(result.current.value).toEqual([]);
  });
  it("should create new empty row", () => {
    // Arrange
    const { result } = renderHook(() => useContainerState(valueProvider));

    // Act
    act(() => {
      result.current.createEmpty();
    });
    // Assert
    expect(result.current.value).toEqual([FilterElement.createEmpty()]);
  });
  it("should add new row", () => {
    // Arrange
    const { result } = renderHook(() => useContainerState(valueProvider));
    const staticPriceElement = new FilterElement(
      new ExpressionValue("price", "Price", "price"),
      new Condition(
        ConditionOptions.fromStaticElementName("price"),
        new ConditionSelected(
          { label: "price", slug: "price", value: "123" },
          { type: "price", value: "123", label: "Price" },
          [],
          false,
        ),
        false,
      ),
      false,
    );

    // Act
    act(() => {
      result.current.createEmpty();
    });
    act(() => {
      result.current.create(staticPriceElement);
    });
    // Assert
    expect(result.current.value).toEqual([FilterElement.createEmpty(), "AND", staticPriceElement]);
  });
  it("should update row", () => {
    // Arrange
    const { result } = renderHook(() => useContainerState(valueProvider));
    const staticPriceElement = new FilterElement(
      new ExpressionValue("price", "Price", "price"),
      new Condition(
        ConditionOptions.fromStaticElementName("price"),
        new ConditionSelected(
          { label: "price", slug: "price", value: "123" },
          { type: "price", value: "123", label: "Price" },
          [],
          false,
        ),
        false,
      ),
      false,
    );

    // Act
    act(() => {
      result.current.create(staticPriceElement);
    });
    act(() => {
      result.current.updateAt("0", el => {
        el.updateLeftOperator({
          type: "category",
          label: "Category",
          slug: "category",
          value: "category",
        });
      });
    });
    // Assert
    expect(result.current.value).toEqual([staticPriceElement]);
  });
  it("should remove row", () => {
    // Arrange
    const { result } = renderHook(() => useContainerState(valueProvider));
    const staticPriceElement = new FilterElement(
      new ExpressionValue("price", "Price", "price"),
      new Condition(
        ConditionOptions.fromStaticElementName("price"),
        new ConditionSelected(
          { label: "price", slug: "price", value: "123" },
          { type: "price", value: "123", label: "Price" },
          [],
          false,
        ),
        false,
      ),
      false,
    );

    // Act
    act(() => {
      result.current.createEmpty();
    });
    act(() => {
      result.current.create(staticPriceElement);
    });
    act(() => {
      result.current.removeAt("0");
    });
    // Assert
    expect(result.current.value).toEqual([staticPriceElement]);
  });
  it("should clear not filled rows", () => {
    // Arrange
    const { result } = renderHook(() => useContainerState(valueProvider));
    const staticPriceElement = new FilterElement(
      new ExpressionValue("price", "Price", "price"),
      new Condition(
        ConditionOptions.fromStaticElementName("price"),
        new ConditionSelected(
          { label: "price", slug: "price", value: "123" },
          { type: "price", value: "123", label: "Price" },
          [],
          false,
        ),
        false,
      ),
      false,
    );

    // Act
    act(() => {
      result.current.createEmpty();
    });
    act(() => {
      result.current.create(staticPriceElement);
    });
    act(() => {
      result.current.clearEmpty();
    });
    // Assert
    expect(result.current.value).toEqual([staticPriceElement]);
  });
});
