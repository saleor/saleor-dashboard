import { renderHook } from "@testing-library/react-hooks";
import { ComponentType, ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { FilterAPIProvider } from "../ConditionalFilter/API/FilterAPIProvider";
import { InitialProductStateResponse } from "../ConditionalFilter/API/initialState/product/InitialProductStateResponse";
import { STATIC_PRODUCT_OPTIONS } from "../ConditionalFilter/constants";
import { Condition } from "../ConditionalFilter/FilterElement/Condition";
import { ConditionOptions } from "../ConditionalFilter/FilterElement/ConditionOptions";
import { ConditionSelected } from "../ConditionalFilter/FilterElement/ConditionSelected";
import {
  ExpressionValue,
  FilterContainer,
  FilterElement,
} from "../ConditionalFilter/FilterElement/FilterElement";
import { QueryApiType } from "../ConditionalFilter/FiltersQueryBuilder/types";
import { FilterValueProvider } from "../ConditionalFilter/FilterValueProvider";
import { FetchingParams } from "../ConditionalFilter/ValueProvider/TokenArray/fetchingParams";
import { InitialStateAPI, LockedFilter, ModalFilterConfig } from "./types";
import { useModalFilters, UseModalFiltersOptions } from "./useModalFilters";

const mockContainerState = {
  value: [] as FilterContainer,
  create: jest.fn(),
  createEmpty: jest.fn(),
  updateAt: jest.fn(),
  removeAt: jest.fn(),
  clearEmpty: jest.fn(),
  clear: jest.fn(),
};

const mockValueProvider: FilterValueProvider = {
  value: [],
  loading: false,
  persist: jest.fn(),
  isPersisted: jest.fn().mockReturnValue(false),
  clear: jest.fn(),
  getTokenByName: jest.fn().mockReturnValue(undefined),
  count: 0,
};

jest.mock("../ConditionalFilter/useFilterLeftOperands", () => {
  const actualMock = jest.fn(() => ({
    operands: [],
    setOperands: jest.fn(),
  }));

  return {
    __esModule: true,
    useFilterLeftOperandsProvider: actualMock,
    getMockFn: (): unknown => actualMock,
  };
});

jest.mock("../ConditionalFilter/useFilterWindow", () => ({
  useFilterWindow: jest.fn(() => ({
    isOpen: false,
    setOpen: jest.fn(),
  })),
}));

jest.mock("../ConditionalFilter/useContainerState", () => ({
  useContainerState: jest.fn(() => mockContainerState),
}));

jest.mock("./useModalUrlValueProvider", () => ({
  useModalUrlValueProvider: jest.fn(() => mockValueProvider),
}));

// Get reference to the mock after module is loaded
const { getMockFn } = jest.requireMock("../ConditionalFilter/useFilterLeftOperands") as {
  getMockFn: () => jest.Mock;
};

const emptyFetchingParams: FetchingParams = {
  category: [],
  collection: [],
  channel: [],
  productType: [],
  attribute: {},
  attributeReference: {},
};

const createMockApiProvider = (): FilterAPIProvider => ({
  fetchRightOptions: jest.fn().mockResolvedValue([]),
  fetchAttributeOptions: jest.fn().mockResolvedValue([]),
});

const createMockInitialState = (
  overrides: Partial<InitialStateAPI<InitialProductStateResponse, FetchingParams>> = {},
): InitialStateAPI<InitialProductStateResponse, FetchingParams> => ({
  data: InitialProductStateResponse.empty(),
  loading: false,
  fetchQueries: jest.fn().mockResolvedValue(undefined),
  ...overrides,
});

type TestQueryVariables = {
  price?: { eq: string };
  category?: { eq: string };
  channel?: { eq: string };
};

const createMockConfig = (
  overrides: Partial<
    ModalFilterConfig<TestQueryVariables, FetchingParams, InitialProductStateResponse>
  > = {},
): ModalFilterConfig<TestQueryVariables, FetchingParams, InitialProductStateResponse> => ({
  staticOptions: STATIC_PRODUCT_OPTIONS,
  queryApiType: QueryApiType.WHERE,
  emptyFetchingParams,
  filterProviderType: "product",
  createQueryVariables: jest.fn().mockReturnValue({}),
  useApiProvider: () => createMockApiProvider(),
  useInitialState: () => createMockInitialState(),
  ...overrides,
});

const createWrapper = (initialPath = "/?action=assign"): ComponentType<any> =>
  function Wrapper({ children }: { children: ReactNode }) {
    return <MemoryRouter initialEntries={[initialPath]}>{children}</MemoryRouter>;
  };

const createProductTypeLockedFilter = (
  productTypes: Array<{ id: string; name: string }>,
): LockedFilter => ({
  field: "productType",
  values: productTypes,
});

const createStaticPriceElement = (): FilterElement => {
  return new FilterElement(
    new ExpressionValue("price", "Price", "price"),
    new Condition(
      ConditionOptions.fromStaticElementName("price"),
      new ConditionSelected(
        { label: "is", slug: "is", value: "input-1" },
        { type: "price", value: "100", label: "100" },
        [],
        false,
      ),
      false,
    ),
    false,
  );
};

describe("useModalFilters", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockContainerState.value = [];
    mockValueProvider.value = [];
    mockValueProvider.count = 0;
    getMockFn().mockReturnValue({
      operands: [],
      setOperands: jest.fn(),
    });
  });

  describe("return structure", () => {
    it("should return filterContext based on config", () => {
      // Arrange
      const wrapper = createWrapper();
      const config = createMockConfig();

      // Act
      const { result } = renderHook(() => useModalFilters(config), { wrapper });

      // Assert
      expect(result.current.filterContext).toBeDefined();
      expect(result.current.filterContext.apiProvider).toBeDefined();
      expect(result.current.filterContext.valueProvider).toBeDefined();
      expect(result.current.filterContext.leftOperandsProvider).toBeDefined();
      expect(result.current.filterContext.containerState).toBeDefined();
      expect(result.current.filterContext.filterWindow).toBeDefined();
      expect(result.current.filterContext.queryApiType).toBe(QueryApiType.WHERE);
    });

    it("should return filterVariables from config's createQueryVariables", () => {
      // Arrange
      const wrapper = createWrapper();
      const mockQueryVars: TestQueryVariables = { price: { eq: "100" } };
      const config = createMockConfig({
        createQueryVariables: jest.fn().mockReturnValue(mockQueryVars),
      });

      // Act
      const { result } = renderHook(() => useModalFilters(config), { wrapper });

      // Assert
      expect(result.current.filterVariables).toEqual(mockQueryVars);
    });

    it("should return clearFilters function", () => {
      // Arrange
      const wrapper = createWrapper();
      const config = createMockConfig();

      // Act
      const { result } = renderHook(() => useModalFilters(config), { wrapper });

      // Assert
      expect(typeof result.current.clearFilters).toBe("function");
    });

    it("should return hasActiveFilters boolean", () => {
      // Arrange
      const wrapper = createWrapper();
      const config = createMockConfig();

      // Act
      const { result } = renderHook(() => useModalFilters(config), { wrapper });

      // Assert
      expect(typeof result.current.hasActiveFilters).toBe("boolean");
    });
  });

  describe("filterChannel extraction", () => {
    it("should extract filterChannel from query variables when channel is present", () => {
      // Arrange
      const wrapper = createWrapper();
      const config = createMockConfig({
        createQueryVariables: jest.fn().mockReturnValue({
          channel: "default-channel",
          price: { eq: "100" },
        }),
      });

      // Act
      const { result } = renderHook(() => useModalFilters(config), { wrapper });

      // Assert
      expect(result.current.filterChannel).toBe("default-channel");
    });

    it("should return undefined filterChannel when channel is not in query variables", () => {
      // Arrange
      const wrapper = createWrapper();
      const config = createMockConfig({
        createQueryVariables: jest.fn().mockReturnValue({
          price: { eq: "100" },
        }),
      });

      // Act
      const { result } = renderHook(() => useModalFilters(config), { wrapper });

      // Assert
      expect(result.current.filterChannel).toBeUndefined();
    });

    it("should not include channel in filterVariables (only in filterChannel)", () => {
      // Arrange
      const wrapper = createWrapper();
      const config = createMockConfig({
        createQueryVariables: jest.fn().mockReturnValue({
          channel: "default-channel",
          price: { eq: "100" },
        }),
      });

      // Act
      const { result } = renderHook(() => useModalFilters(config), { wrapper });

      // Assert
      expect(result.current.filterVariables).toEqual({ price: { eq: "100" } });
      expect((result.current.filterVariables as any).channel).toBeUndefined();
    });
  });

  describe("hasActiveFilters", () => {
    it("should return false when no filters are active", () => {
      // Arrange
      const wrapper = createWrapper();
      const config = createMockConfig();

      // Act
      const { result } = renderHook(() => useModalFilters(config), { wrapper });

      // Assert
      expect(result.current.hasActiveFilters).toBe(false);
    });

    it("should return false when only locked filter is active", () => {
      // Arrange
      const wrapper = createWrapper();
      const config = createMockConfig({
        lockedFilterField: "productType",
      });
      const options: UseModalFiltersOptions = {
        lockedFilter: createProductTypeLockedFilter([{ id: "pt-1", name: "Simple" }]),
      };

      mockValueProvider.value = [];
      mockValueProvider.count = 0;

      // Act
      const { result } = renderHook(() => useModalFilters(config, options), { wrapper });

      // Assert
      expect(result.current.hasActiveFilters).toBe(false);
    });

    it("should return true when active filters are present (excluding locked filter)", () => {
      // Arrange
      const wrapper = createWrapper();
      const config = createMockConfig({
        lockedFilterField: "productType",
      });
      const options: UseModalFiltersOptions = {
        lockedFilter: createProductTypeLockedFilter([{ id: "pt-1", name: "Simple" }]),
      };

      const priceFilterElement = createStaticPriceElement();

      mockValueProvider.value = [priceFilterElement];
      mockValueProvider.count = 1;

      // Act
      const { result } = renderHook(() => useModalFilters(config, options), { wrapper });

      // Assert
      expect(result.current.hasActiveFilters).toBe(true);
    });
  });

  describe("lockedFilter option", () => {
    it("should wrap value provider when lockedFilter is provided", () => {
      // Arrange
      const wrapper = createWrapper();
      const config = createMockConfig({
        lockedFilterField: "productType",
      });
      const options: UseModalFiltersOptions = {
        lockedFilter: createProductTypeLockedFilter([{ id: "pt-1", name: "Simple" }]),
      };

      // Act
      const { result } = renderHook(() => useModalFilters(config, options), { wrapper });

      // Assert
      expect(result.current.filterContext.valueProvider).toBeDefined();
    });

    it("should not modify valueProvider when lockedFilter is not provided", () => {
      // Arrange
      const wrapper = createWrapper();
      const config = createMockConfig();

      // Act
      const { result } = renderHook(() => useModalFilters(config), { wrapper });

      // Assert
      expect(result.current.filterContext.valueProvider.value).toEqual([]);
    });

    it("should prepend locked element to value when lockedFilter is provided and no other filters exist", () => {
      // Arrange
      const wrapper = createWrapper();
      const config = createMockConfig({
        lockedFilterField: "productType",
      });
      const options: UseModalFiltersOptions = {
        lockedFilter: createProductTypeLockedFilter([{ id: "pt-1", name: "Simple" }]),
      };

      mockValueProvider.value = [];
      mockValueProvider.count = 0;

      // Act
      const { result } = renderHook(() => useModalFilters(config, options), { wrapper });

      // Assert
      expect(result.current.filterContext.valueProvider.value).toHaveLength(1);
      expect(result.current.filterContext.valueProvider.value[0]).toBeInstanceOf(FilterElement);
    });

    it("should prepend locked element with AND separator when other filters exist", () => {
      // Arrange
      const wrapper = createWrapper();
      const config = createMockConfig({
        lockedFilterField: "productType",
      });
      const options: UseModalFiltersOptions = {
        lockedFilter: createProductTypeLockedFilter([{ id: "pt-1", name: "Simple" }]),
      };

      const priceFilterElement = createStaticPriceElement();

      mockValueProvider.value = [priceFilterElement];
      mockValueProvider.count = 1;

      // Act
      const { result } = renderHook(() => useModalFilters(config, options), { wrapper });

      // Assert
      expect(result.current.filterContext.valueProvider.value).toHaveLength(3);
      expect(result.current.filterContext.valueProvider.value[0]).toBeInstanceOf(FilterElement);
      expect(result.current.filterContext.valueProvider.value[1]).toBe("AND");
      expect(result.current.filterContext.valueProvider.value[2]).toBe(priceFilterElement);
    });

    it("should exclude locked filter from count calculation", () => {
      // Arrange
      const wrapper = createWrapper();
      const config = createMockConfig({
        lockedFilterField: "productType",
      });
      const options: UseModalFiltersOptions = {
        lockedFilter: createProductTypeLockedFilter([{ id: "pt-1", name: "Simple" }]),
      };

      mockValueProvider.value = [];
      mockValueProvider.count = 0;

      // Act
      const { result } = renderHook(() => useModalFilters(config, options), { wrapper });

      // Assert
      expect(result.current.filterContext.valueProvider.count).toBe(0);
    });
  });

  describe("clearFilters behavior", () => {
    it("should call both valueProvider.clear and containerState.clear when clearFilters is called", () => {
      // Arrange
      const wrapper = createWrapper();
      const config = createMockConfig();

      // Act
      const { result } = renderHook(() => useModalFilters(config), { wrapper });

      result.current.clearFilters();

      // Assert
      expect(mockValueProvider.clear).toHaveBeenCalled();
      expect(mockContainerState.clear).toHaveBeenCalled();
    });
  });

  describe("excludedFilters option", () => {
    it("should filter out excluded options from staticOptions", () => {
      // Arrange
      const wrapper = createWrapper();
      const config = createMockConfig();
      const options: UseModalFiltersOptions = {
        excludedFilters: ["price", "category"],
      };

      // Act
      renderHook(() => useModalFilters(config, options), { wrapper });

      // Assert
      const mockFn = getMockFn();
      const filteredOptions = (mockFn.mock.calls[0] as unknown[])[0] as Array<{
        value: string;
      }>;

      expect(filteredOptions.some(o => o.value === "price")).toBe(false);
      expect(filteredOptions.some(o => o.value === "category")).toBe(false);
    });

    it("should pass all options when excludedFilters is not provided", () => {
      // Arrange
      const wrapper = createWrapper();
      const config = createMockConfig();

      // Act
      renderHook(() => useModalFilters(config), { wrapper });

      // Assert
      const mockFn = getMockFn();
      const passedOptions = (mockFn.mock.calls[0] as unknown[])[0] as Array<{
        value: string;
      }>;

      expect(passedOptions.length).toBe(STATIC_PRODUCT_OPTIONS.length);
    });

    it("should filter out lockedFilter field from staticOptions", () => {
      // Arrange
      const wrapper = createWrapper();
      const config = createMockConfig({
        lockedFilterField: "productType",
      });
      const options: UseModalFiltersOptions = {
        lockedFilter: createProductTypeLockedFilter([{ id: "pt-1", name: "Simple" }]),
      };

      // Act
      renderHook(() => useModalFilters(config, options), { wrapper });

      // Assert
      const mockFn = getMockFn();
      const filteredOptions = (mockFn.mock.calls[0] as unknown[])[0] as Array<{
        value: string;
      }>;

      expect(filteredOptions.some(o => o.value === "productType")).toBe(false);
    });

    it("should filter out both excludedFilters and lockedFilter field", () => {
      // Arrange
      const wrapper = createWrapper();
      const config = createMockConfig({
        lockedFilterField: "productType",
      });
      const options: UseModalFiltersOptions = {
        excludedFilters: ["price"],
        lockedFilter: createProductTypeLockedFilter([{ id: "pt-1", name: "Simple" }]),
      };

      // Act
      renderHook(() => useModalFilters(config, options), { wrapper });

      // Assert
      const mockFn = getMockFn();
      const filteredOptions = (mockFn.mock.calls[0] as unknown[])[0] as Array<{
        value: string;
      }>;

      expect(filteredOptions.some(o => o.value === "price")).toBe(false);
      expect(filteredOptions.some(o => o.value === "productType")).toBe(false);
    });
  });

  describe("wrapped valueProvider methods", () => {
    const setupWithLockedFilter = (): {
      readonly wrapper: ComponentType<any>;
      readonly config: ModalFilterConfig<
        TestQueryVariables,
        FetchingParams,
        InitialProductStateResponse
      >;
      readonly options: UseModalFiltersOptions;
    } => {
      const wrapper = createWrapper();
      const config = createMockConfig({
        lockedFilterField: "productType",
      });
      const options: UseModalFiltersOptions = {
        lockedFilter: createProductTypeLockedFilter([{ id: "pt-1", name: "Simple" }]),
      };

      return { wrapper, config, options } as const;
    };

    it("should return undefined for lockedFilterField when getTokenByName is called", () => {
      // Arrange
      const { wrapper, config, options } = setupWithLockedFilter();

      // Act
      const { result } = renderHook(() => useModalFilters(config, options), { wrapper });
      const token = result.current.filterContext.valueProvider.getTokenByName("productType");

      // Assert
      expect(token).toBeUndefined();
    });

    it("should delegate getTokenByName to original valueProvider for non-locked fields", () => {
      // Arrange
      const { wrapper, config, options } = setupWithLockedFilter();

      // Act
      const { result } = renderHook(() => useModalFilters(config, options), { wrapper });

      result.current.filterContext.valueProvider.getTokenByName("price");

      // Assert
      expect(mockValueProvider.getTokenByName).toHaveBeenCalledWith("price");
    });

    it("should return true for isPersisted when element has global constraint", () => {
      // Arrange
      const { wrapper, config, options } = setupWithLockedFilter();

      // Act
      const { result } = renderHook(() => useModalFilters(config, options), { wrapper });
      const lockedElement = result.current.filterContext.valueProvider.value[0] as FilterElement;
      const isPersisted = result.current.filterContext.valueProvider.isPersisted(lockedElement);

      // Assert
      expect(isPersisted).toBe(true);
    });
  });
});
