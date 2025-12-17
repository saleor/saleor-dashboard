import { act, renderHook } from "@testing-library/react-hooks";
import React from "react";
import { useHistory } from "react-router";
import { MemoryRouter } from "react-router-dom";

import { InitialProductStateResponse } from "../ConditionalFilter/API/initialState/product/InitialProductStateResponse";
import { InitialProductAPIState } from "../ConditionalFilter/API/initialState/product/useProductInitialAPIState";
import { Condition } from "../ConditionalFilter/FilterElement/Condition";
import { ConditionOptions } from "../ConditionalFilter/FilterElement/ConditionOptions";
import { ConditionSelected } from "../ConditionalFilter/FilterElement/ConditionSelected";
import { ExpressionValue, FilterElement } from "../ConditionalFilter/FilterElement/FilterElement";
import { useModalUrlValueProvider } from "./useModalUrlValueProvider";

const createCategoryFilterElement = (): FilterElement => {
  return new FilterElement(
    new ExpressionValue("category", "Category", "category"),
    new Condition(
      ConditionOptions.fromStaticElementName("category"),
      new ConditionSelected(
        { label: "is", slug: "is", value: "input-1" },
        { type: "category", value: "cat-123", label: "Electronics" },
        [],
        false,
      ),
      false,
    ),
    false,
  );
};

const createChannelFilterElement = (): FilterElement => {
  return new FilterElement(
    new ExpressionValue("channel", "Channel", "channel"),
    new Condition(
      ConditionOptions.fromStaticElementName("channel"),
      new ConditionSelected(
        { label: "is", slug: "is", value: "input-1" },
        { type: "channel", value: "channel-usd", label: "USD Channel" },
        [],
        false,
      ),
      false,
    ),
    false,
  );
};

const createWrapper = (initialPath: string): React.ComponentType<any> =>
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <MemoryRouter initialEntries={[initialPath]}>{children}</MemoryRouter>;
  };

describe("useModalUrlValueProvider", () => {
  describe("infinite re-render prevention", () => {
    it("should not refetch when initialState.fetchQueries identity changes", () => {
      // Arrange
      const fetchQueriesFirst = jest.fn().mockResolvedValue(undefined);
      const fetchQueriesSecond = jest.fn().mockResolvedValue(undefined);

      const wrapper = createWrapper("/?action=assign&id=1");

      const initialStateFirst: InitialProductAPIState = {
        data: InitialProductStateResponse.empty(),
        loading: true,
        fetchQueries: fetchQueriesFirst,
      };

      const initialStateSecond: InitialProductAPIState = {
        data: InitialProductStateResponse.empty(),
        loading: true,
        fetchQueries: fetchQueriesSecond,
      };

      // Act
      const hook = renderHook<
        { initialState: InitialProductAPIState },
        ReturnType<typeof useModalUrlValueProvider>
      >(({ initialState }) => useModalUrlValueProvider(initialState), {
        wrapper,
        initialProps: { initialState: initialStateFirst },
      });

      act(() => {
        hook.rerender({ initialState: initialStateSecond });
      });

      // Assert - only first fetchQueries should be called
      expect(fetchQueriesFirst).toHaveBeenCalledTimes(1);
      expect(fetchQueriesSecond).toHaveBeenCalledTimes(0);
    });
  });

  describe("loading state", () => {
    it("should return loading true when initialState is loading", () => {
      // Arrange
      const wrapper = createWrapper("/?action=assign");

      const initialState: InitialProductAPIState = {
        data: InitialProductStateResponse.empty(),
        loading: true,
        fetchQueries: jest.fn(),
      };

      // Act
      const { result } = renderHook(() => useModalUrlValueProvider(initialState), { wrapper });

      // Assert
      expect(result.current.loading).toBe(true);
    });

    it("should return loading false when no initialState provided", () => {
      // Arrange
      const wrapper = createWrapper("/?action=assign");

      // Act
      const { result } = renderHook(() => useModalUrlValueProvider(), { wrapper });

      // Assert
      expect(result.current.loading).toBe(false);
    });

    it("should return loading false when initialState has finished loading", () => {
      // Arrange
      const wrapper = createWrapper("/?action=assign");

      const initialState: InitialProductAPIState = {
        data: InitialProductStateResponse.empty(),
        loading: false,
        fetchQueries: jest.fn(),
      };

      // Act
      const { result } = renderHook(() => useModalUrlValueProvider(initialState), { wrapper });

      // Assert
      expect(result.current.loading).toBe(false);
    });
  });

  describe("value and count", () => {
    it("should return empty value array initially", () => {
      // Arrange
      const wrapper = createWrapper("/?action=assign");

      // Act
      const { result } = renderHook(() => useModalUrlValueProvider(), { wrapper });

      // Assert
      expect(result.current.value).toEqual([]);
    });

    it("should return count 0 when no filters are applied", () => {
      // Arrange
      const wrapper = createWrapper("/?action=assign");

      // Act
      const { result } = renderHook(() => useModalUrlValueProvider(), { wrapper });

      // Assert
      expect(result.current.count).toBe(0);
    });

    it("should update value when persist is called", () => {
      // Arrange
      const wrapper = createWrapper("/?action=assign");
      const { result } = renderHook(() => useModalUrlValueProvider(), { wrapper });

      // Create a simple mock filter container
      const mockFilterValue: any[] = [];

      // Act
      act(() => {
        result.current.persist(mockFilterValue);
      });

      // Assert
      expect(result.current.value).toEqual(mockFilterValue);
    });

    it("should reset value to empty array when clear is called", () => {
      // Arrange
      const wrapper = createWrapper("/?action=assign");
      const { result } = renderHook(() => useModalUrlValueProvider(), { wrapper });

      // First set some value
      act(() => {
        result.current.persist([]);
      });

      // Act
      act(() => {
        result.current.clear();
      });

      // Assert
      expect(result.current.value).toEqual([]);
    });
  });

  describe("isPersisted", () => {
    it("should return false for elements not in current value", () => {
      // Arrange
      const wrapper = createWrapper("/?action=assign");
      const { result } = renderHook(() => useModalUrlValueProvider(), { wrapper });

      const mockElement = {
        equals: jest.fn().mockReturnValue(false),
      };

      // Act
      const isPersisted = result.current.isPersisted(mockElement as any);

      // Assert
      expect(isPersisted).toBe(false);
    });
  });

  describe("getTokenByName", () => {
    it("should return undefined when URL has no filter params", () => {
      // Arrange
      const wrapper = createWrapper("/products?action=assign&id=attr-1");
      const { result } = renderHook(() => useModalUrlValueProvider(), { wrapper });

      // Act
      const token = result.current.getTokenByName("category");

      // Assert
      expect(token).toBeUndefined();
    });

    it("should find token by name when filter exists in URL", () => {
      // Arrange
      const wrapper = createWrapper(
        "/products?0%5Bs0.category%5D=cat-1&1=AND&2%5Bs0.channel%5D=channel-usd",
      );
      const { result } = renderHook(() => useModalUrlValueProvider(), { wrapper });

      // Act
      const categoryToken = result.current.getTokenByName("category");
      const channelToken = result.current.getTokenByName("channel");

      // Assert
      expect(categoryToken?.name).toBe("category");
      expect(channelToken?.name).toBe("channel");
    });
  });

  describe("persist and clear URL handling", () => {
    it("should serialize single filter to URL while preserving existing URL params", () => {
      // Arrange
      const wrapper = createWrapper("/products?action=assign&id=attr-1");
      const categoryFilter = createCategoryFilterElement();

      const { result } = renderHook(
        () => {
          const valueProvider = useModalUrlValueProvider();
          const history = useHistory();

          return { valueProvider, history };
        },
        { wrapper },
      );

      // Act
      act(() => {
        result.current.valueProvider.persist([categoryFilter]);
      });

      // Assert
      expect(result.current.history.location.search).toMatchInlineSnapshot(
        `"?0%5Bs-1.category%5D=is&action=assign&id=attr-1"`,
      );
    });

    it("should serialize multiple filters to URL", () => {
      // Arrange
      const wrapper = createWrapper("/products?action=assign&id=attr-1");
      const categoryFilter = createCategoryFilterElement();
      const channelFilter = createChannelFilterElement();

      const { result } = renderHook(
        () => {
          const valueProvider = useModalUrlValueProvider();
          const history = useHistory();

          return { valueProvider, history };
        },
        { wrapper },
      );

      // Act
      act(() => {
        result.current.valueProvider.persist([categoryFilter, "AND", channelFilter]);
      });

      // Assert
      expect(result.current.history.location.search).toMatchInlineSnapshot(
        `"?0%5Bs-1.category%5D=is&1=AND&2%5Bs-1.channel%5D=is&action=assign&id=attr-1"`,
      );
    });

    it("should replace old filter params when persisting new filters", () => {
      // Arrange - URL has existing filter param
      const wrapper = createWrapper("/products?action=assign&id=attr-1&0%5Bs0.category%5D=old-cat");
      const channelFilter = createChannelFilterElement();

      const { result } = renderHook(
        () => {
          const valueProvider = useModalUrlValueProvider();
          const history = useHistory();

          return { valueProvider, history };
        },
        { wrapper },
      );

      // Act
      act(() => {
        result.current.valueProvider.persist([channelFilter]);
      });

      // Assert
      expect(result.current.history.location.search).toMatchInlineSnapshot(
        `"?0%5Bs-1.channel%5D=is&action=assign&id=attr-1"`,
      );
    });

    it("should preserve custom params while persisting filters", () => {
      // Arrange
      const wrapper = createWrapper("/products?action=assign&id=attr-1&customParam=keep");
      const categoryFilter = createCategoryFilterElement();

      const { result } = renderHook(
        () => {
          const valueProvider = useModalUrlValueProvider();
          const history = useHistory();

          return { valueProvider, history };
        },
        { wrapper },
      );

      // Act
      act(() => {
        result.current.valueProvider.persist([categoryFilter]);
      });

      // Assert
      expect(result.current.history.location.search).toMatchInlineSnapshot(
        `"?0%5Bs-1.category%5D=is&action=assign&id=attr-1&customParam=keep"`,
      );
    });

    it("should remove filter params and preserve modal params when clearing", () => {
      // Arrange - URL has modal params and filter params
      const wrapper = createWrapper("/products?action=assign&id=attr-1&0%5Bs0.category%5D=cat-1");

      const { result } = renderHook(
        () => {
          const valueProvider = useModalUrlValueProvider();
          const history = useHistory();

          return { valueProvider, history };
        },
        { wrapper },
      );

      // Act
      act(() => {
        result.current.valueProvider.clear();
      });

      // Assert
      expect(result.current.history.location.search).toMatchInlineSnapshot(
        `"?action=assign&id=attr-1"`,
      );
    });
  });
});
