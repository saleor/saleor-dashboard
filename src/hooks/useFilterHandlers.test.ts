// @ts-strict-ignore
import { renderHook } from "@testing-library/react-hooks";

import { useFilterHandlers } from "./useFilterHandlers";

jest.mock("./useNavigator", () => () => jest.fn());
describe("useFilterHandlers", () => {
  describe("resetFilters", () => {
    test("should run cleanup function and call createUrl function", () => {
      // Arrange
      const cleanupFn = jest.fn();
      const createUrl = jest.fn();
      const { result } = renderHook(() =>
        useFilterHandlers({
          getFilterQueryParam: jest.fn(),
          createUrl,
          cleanupFn,
          params: {
            activeTab: "tab",
            asc: true,
            sort: "sort",
            query: "query",
          },
          defaultSortField: "",
          keepActiveTab: false,
        }),
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const resetFilters = result.current[1];

      // Act
      resetFilters();
      // Assert
      expect(cleanupFn).toHaveBeenCalledTimes(1);
      expect(createUrl).toHaveBeenCalledWith({
        asc: true,
        sort: "sort",
      });
    });
  });
  describe("changeFilters", () => {
    test("should call cleanup function when provided", () => {
      const cleanupFn = jest.fn();
      const { result } = renderHook(() =>
        useFilterHandlers({
          getFilterQueryParam: jest.fn(),
          createUrl: jest.fn(),
          cleanupFn,
          params: {
            activeTab: "tab",
            asc: true,
            sort: "sort",
            query: "query",
          },
          defaultSortField: "",
          keepActiveTab: false,
        }),
      );
      const [changeFilters] = result.current;

      // Act
      changeFilters([]);
      // Assert
      expect(cleanupFn).toHaveBeenCalledTimes(1);
    });
    test("should call createUrl function with with proper params when no filters", () => {
      const createUrl = jest.fn();
      const { result } = renderHook(() =>
        useFilterHandlers({
          getFilterQueryParam: jest.fn(filter => ({
            [filter.name]: filter.value,
          })),
          createUrl,
          params: {
            activeTab: "tab",
            asc: true,
            sort: "sort",
            query: "query",
          },
          defaultSortField: "",
          keepActiveTab: false,
        }),
      );
      const [changeFilters] = result.current;

      // Act
      changeFilters([]);
      // Assert
      expect(createUrl).toHaveBeenCalledWith({
        asc: true,
        sort: "sort",
        query: "query",
        activeTab: undefined,
      });
    });
    test("should call createUrl function with with proper params when filters selected", () => {
      const createUrl = jest.fn();
      const { result } = renderHook(() =>
        useFilterHandlers({
          getFilterQueryParam: jest.fn(filter => ({
            [filter.name]: filter.value[0],
          })),
          createUrl,
          params: {
            activeTab: "tab",
            asc: true,
            sort: "sort",
            query: "query",
          },
          defaultSortField: "",
          keepActiveTab: false,
        }),
      );
      const [changeFilters] = result.current;

      // Act
      changeFilters([
        {
          name: "filter",
          value: ["value"],
          label: "test",
          active: true,
          multiple: false,
        },
        {
          name: "filterOther",
          value: ["valueOther"],
          label: "test",
          active: true,
          multiple: false,
        },
      ]);
      // Assert
      expect(createUrl).toHaveBeenCalledWith({
        filter: "value",
        filterOther: "valueOther",
        asc: true,
        sort: "sort",
        query: "query",
        activeTab: undefined,
      });
    });
    test("should call createUrl function with active tab value when keepActiveTab is true", () => {
      const createUrl = jest.fn();
      const { result } = renderHook(() =>
        useFilterHandlers({
          getFilterQueryParam: jest.fn(filter => ({
            [filter.name]: filter.value[0],
          })),
          createUrl,
          params: {
            activeTab: "tab",
            asc: true,
            sort: "sort",
            query: "query",
          },
          defaultSortField: "",
          keepActiveTab: true,
        }),
      );
      const [changeFilters] = result.current;

      // Act
      changeFilters([
        {
          name: "filter",
          value: ["value"],
          label: "test",
          active: true,
          multiple: false,
        },
      ]);
      // Assert
      expect(createUrl).toHaveBeenCalledWith({
        filter: "value",
        asc: true,
        sort: "sort",
        query: "query",
        activeTab: "tab",
      });
    });
  });
  describe("handleSearchChange", () => {
    test("should call createUrl function when provided", () => {
      const cleanupFn = jest.fn();
      const { result } = renderHook(() =>
        useFilterHandlers({
          getFilterQueryParam: jest.fn(),
          createUrl: jest.fn(),
          cleanupFn,
          params: {
            activeTab: "tab",
            asc: true,
            sort: "sort",
            query: "query",
          },
          defaultSortField: "",
          keepActiveTab: false,
        }),
      );
      const handleSearchChange = result.current[2];

      // Act
      handleSearchChange("queryTest");
      // Assert
      expect(cleanupFn).toHaveBeenCalledTimes(1);
    });
    test("should run createUrl function with params and query", () => {
      const createUrl = jest.fn();
      const { result } = renderHook(() =>
        useFilterHandlers({
          getFilterQueryParam: jest.fn(filter => ({
            [filter.name]: filter.value[0],
          })),
          createUrl,
          params: {
            activeTab: "tab",
            asc: true,
            sort: "sort",
            query: "query",
          },
          defaultSortField: "",
          keepActiveTab: false,
        }),
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const handleSearchChange = result.current[2];

      // Act
      handleSearchChange("queryTest");
      // Assert
      expect(createUrl).toHaveBeenCalledWith({
        after: undefined,
        before: undefined,
        asc: true,
        sort: "sort",
        query: "queryTest",
        activeTab: undefined,
      });
    });
    test("should run createUrl function  with sort rank and asc false when hasSortWithRank is true", () => {
      const createUrl = jest.fn();
      const { result } = renderHook(() =>
        useFilterHandlers({
          getFilterQueryParam: jest.fn(filter => ({
            [filter.name]: filter.value[0],
          })),
          createUrl,
          params: {
            activeTab: "tab",
            asc: true,
            sort: "sort",
            query: "query",
          },
          hasSortWithRank: true,
          defaultSortField: "",
          keepActiveTab: false,
        }),
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const handleSearchChange = result.current[2];

      // Act
      handleSearchChange("queryTest");
      // Assert
      expect(createUrl).toHaveBeenCalledWith({
        after: undefined,
        before: undefined,
        asc: false,
        sort: "rank",
        query: "queryTest",
        activeTab: undefined,
      });
    });
  });
});
