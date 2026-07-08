import { act, renderHook } from "@testing-library/react";

import { Condition, FilterElement } from "./FilterElement";
import { ConditionOptions } from "./FilterElement/ConditionOptions";
import { ConditionSelected } from "./FilterElement/ConditionSelected";
import { ExpressionValue } from "./FilterElement/FilterElement";
import { type FilterValueProvider } from "./FilterValueProvider";
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

  it("should initialize from a non-empty value provider", () => {
    // Arrange
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
    const providerWithValue: FilterValueProvider = {
      ...valueProvider,
      value: [staticPriceElement],
    };

    // Act
    const { result } = renderHook(() => useContainerState(providerWithValue));

    // Assert
    expect(result.current.value).toEqual([staticPriceElement]);
  });

  it("should reset editable rows back to the provider value", () => {
    // Arrange
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
    const providerWithValue: FilterValueProvider = {
      ...valueProvider,
      value: [staticPriceElement],
    };
    const { result } = renderHook(() => useContainerState(providerWithValue));

    act(() => {
      result.current.createEmpty();
    });

    expect(result.current.value).toHaveLength(3);

    // Act
    act(() => {
      result.current.resetToProvider();
    });

    // Assert
    expect(result.current.value).toEqual([staticPriceElement]);
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
  it("should keep draft rows when provider loading toggles without persisted updates", () => {
    // Arrange
    const provider: FilterValueProvider = {
      ...valueProvider,
      loading: true,
      value: [],
      count: 0,
    };
    const { result, rerender } = renderHook(
      ({ currentProvider }) => useContainerState(currentProvider),
      {
        initialProps: { currentProvider: provider },
      },
    );

    act(() => {
      result.current.createEmpty();
    });

    // Act
    rerender({
      currentProvider: {
        ...provider,
        loading: false,
        value: [],
        count: 0,
      },
    });

    // Assert
    expect(result.current.value).toEqual([FilterElement.createEmpty()]);
  });
  it("should keep draft rows when provider re-renders without persisted updates", () => {
    // Arrange
    const provider: FilterValueProvider = {
      ...valueProvider,
      value: [],
      count: 0,
    };
    const { result, rerender } = renderHook(
      ({ currentProvider }) => useContainerState(currentProvider),
      {
        initialProps: { currentProvider: provider },
      },
    );

    act(() => {
      result.current.createEmpty();
    });

    // Act
    rerender({
      currentProvider: {
        ...provider,
        value: [],
        count: 0,
      },
    });

    // Assert
    expect(result.current.value).toEqual([FilterElement.createEmpty()]);
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

  it("should sync container when persisted filter values change", () => {
    // Arrange
    const shoesFilter = new FilterElement(
      new ExpressionValue("category", "Category", "category"),
      new Condition(
        ConditionOptions.fromStaticElementName("category"),
        new ConditionSelected(
          { label: "Shoes", value: "cat-shoes", slug: "shoes" },
          { type: "multiselect", label: "in", value: "input-4" },
          [],
          false,
        ),
        false,
      ),
      false,
    );
    const bootsFilter = new FilterElement(
      new ExpressionValue("category", "Category", "category"),
      new Condition(
        ConditionOptions.fromStaticElementName("category"),
        new ConditionSelected(
          { label: "Boots", value: "cat-boots", slug: "boots" },
          { type: "multiselect", label: "in", value: "input-4" },
          [],
          false,
        ),
        false,
      ),
      false,
    );
    const provider: FilterValueProvider = {
      ...valueProvider,
      value: [shoesFilter],
      count: 1,
    };
    const { result, rerender } = renderHook(
      ({ currentProvider }) => useContainerState(currentProvider),
      {
        initialProps: { currentProvider: provider },
      },
    );

    // Act
    rerender({
      currentProvider: {
        ...provider,
        value: [bootsFilter],
        count: 1,
      },
    });

    // Assert
    expect(result.current.value).toEqual([bootsFilter]);
  });

  it("should keep unpersisted filled rows when adding another filter", () => {
    // Arrange
    const provider: FilterValueProvider = {
      ...valueProvider,
      isPersisted: () => false,
    };
    const { result } = renderHook(() => useContainerState(provider));
    const categoryFilter = new FilterElement(
      new ExpressionValue("category", "Category", "category"),
      new Condition(
        ConditionOptions.fromStaticElementName("category"),
        new ConditionSelected(
          { label: "Shoes", value: "cat-shoes", slug: "shoes" },
          { type: "multiselect", label: "in", value: "input-4" },
          [],
          false,
        ),
        false,
      ),
      false,
    );

    act(() => {
      result.current.create(categoryFilter);
    });

    // Act
    act(() => {
      result.current.createAndRemoveEmpty(FilterElement.createEmpty());
    });

    // Assert
    expect(result.current.value).toEqual([categoryFilter, "AND", FilterElement.createEmpty()]);
  });
});
