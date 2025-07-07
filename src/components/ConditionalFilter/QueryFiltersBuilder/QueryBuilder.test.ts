import { Condition } from "../FilterElement/Condition";
import { ExpressionValue, FilterElement } from "../FilterElement/FilterElement";
import { FilterQueryVarsBuilderResolver } from "./FilterQueryVarsBuilderResolver";
import { QueryBuilder } from "./QueryBuilder";
import { FilterDefinition } from "./queryVarsBuilders/types";
import { QueryApiType } from "./types";

describe("QueryBuilder", () => {
  describe("build for WHERE API", () => {
    it("should build empty query for empty filter container", () => {
      // Arrange
      const container: FilterElement[] = [];
      const builder = new QueryBuilder(QueryApiType.WHERE, container);

      // Act
      const result = builder.build();

      // Assert
      expect(result).toEqual({ topLevel: {}, filters: {} });
    });

    it("should build query with single filter element", () => {
      // Arrange
      const element = new FilterElement(
        new ExpressionValue("foo", "Foo", "foo"),
        Condition.createEmpty(),
        false,
      );
      const mockDef: FilterDefinition<Record<string, unknown>> = {
        canHandle: jest.fn(() => true),
        createOptionFetcher: jest.fn(),
        updateWhereQuery: jest.fn((query, el) => ({ ...query, [el.value.value]: "where" })),
      };
      const resolver = new FilterQueryVarsBuilderResolver([mockDef]);
      const builder = new QueryBuilder(QueryApiType.WHERE, [element], [], resolver);

      // Act
      const result = builder.build();

      // Assert
      expect(result.filters).toEqual({ foo: "where" });
      expect(result.topLevel).toEqual({});
      expect(mockDef.updateWhereQuery as jest.Mock).toHaveBeenCalled();
    });

    it("should build query with multiple filter elements", () => {
      // Arrange
      const element1 = new FilterElement(
        new ExpressionValue("foo", "Foo", "foo"),
        Condition.createEmpty(),
        false,
      );
      const element2 = new FilterElement(
        new ExpressionValue("bar", "Bar", "bar"),
        Condition.createEmpty(),
        false,
      );
      const mockDef: FilterDefinition<Record<string, unknown>> = {
        canHandle: jest.fn(() => true),
        createOptionFetcher: jest.fn(),
        updateWhereQuery: jest.fn((query, el) => ({ ...query, [el.value.value]: "where" })),
      };
      const resolver = new FilterQueryVarsBuilderResolver([mockDef]);
      const builder = new QueryBuilder(QueryApiType.WHERE, [element1, element2], [], resolver);

      // Act
      const result = builder.build();

      // Assert
      expect(result.filters).toEqual({ foo: "where", bar: "where" });
    });

    it("should throw error if definition doesn't support WHERE API", () => {
      // Arrange
      const element = new FilterElement(
        new ExpressionValue("foo", "Foo", "foo"),
        Condition.createEmpty(),
        false,
      );
      // The method is not present at all, so the type guard fails
      const mockDef = {
        canHandle: jest.fn(() => true),
        createOptionFetcher: jest.fn(),
        // no updateWhereQuery property
      } as unknown as FilterDefinition<Record<string, unknown>>;
      const resolver = new FilterQueryVarsBuilderResolver([mockDef]);
      const builder = new QueryBuilder(QueryApiType.WHERE, [element], [], resolver);

      // Act & Assert
      expect(() => builder.build()).toThrow(/does not support WHERE API/);
    });
  });

  describe("build for FILTER API", () => {
    it("should build empty query for empty filter container", () => {
      // Arrange
      const container: FilterElement[] = [];
      const builder = new QueryBuilder(QueryApiType.FILTER, container);

      // Act
      const result = builder.build();

      // Assert
      expect(result).toEqual({ topLevel: {}, filters: {} });
    });

    it("should build query with single filter element", () => {
      // Arrange
      const element = new FilterElement(
        new ExpressionValue("foo", "Foo", "foo"),
        Condition.createEmpty(),
        false,
      );
      const mockDef: FilterDefinition<Record<string, unknown>> = {
        canHandle: jest.fn(() => true),
        createOptionFetcher: jest.fn(),
        updateFilterQuery: jest.fn((query, el) => ({ ...query, [el.value.value]: "filter" })),
      };
      const resolver = new FilterQueryVarsBuilderResolver([mockDef]);
      const builder = new QueryBuilder(QueryApiType.FILTER, [element], [], resolver);

      // Act
      const result = builder.build();

      // Assert
      expect(result.filters).toEqual({ foo: "filter" });
      expect(result.topLevel).toEqual({});
      expect(mockDef.updateFilterQuery as jest.Mock).toHaveBeenCalled();
    });

    it("should build query with multiple filter elements", () => {
      // Arrange
      const element1 = new FilterElement(
        new ExpressionValue("foo", "Foo", "foo"),
        Condition.createEmpty(),
        false,
      );
      const element2 = new FilterElement(
        new ExpressionValue("bar", "Bar", "bar"),
        Condition.createEmpty(),
        false,
      );
      const mockDef: FilterDefinition<Record<string, unknown>> = {
        canHandle: jest.fn(() => true),
        createOptionFetcher: jest.fn(),
        updateFilterQuery: jest.fn((query, el) => ({ ...query, [el.value.value]: "filter" })),
      };
      const resolver = new FilterQueryVarsBuilderResolver([mockDef]);
      const builder = new QueryBuilder(QueryApiType.FILTER, [element1, element2], [], resolver);
      // Act
      const result = builder.build();

      // Assert
      expect(result.filters).toEqual({ foo: "filter", bar: "filter" });
    });

    it("should throw error if definition doesn't support FILTER API", () => {
      // Arrange
      const element = new FilterElement(
        new ExpressionValue("foo", "Foo", "foo"),
        Condition.createEmpty(),
        false,
      );
      const mockDef = {
        canHandle: jest.fn(() => true),
        createOptionFetcher: jest.fn(),
        // no updateFilterQuery property
      } as unknown as FilterDefinition<Record<string, unknown>>;
      const resolver = new FilterQueryVarsBuilderResolver([mockDef]);
      const builder = new QueryBuilder(QueryApiType.FILTER, [element], [], resolver);

      // Act & Assert
      expect(() => builder.build()).toThrow(/does not support FILTER API/);
    });
  });

  describe("element filtering", () => {
    it("should skip non-FilterElement items in container", () => {
      // Arrange
      const element = new FilterElement(
        new ExpressionValue("foo", "Foo", "foo"),
        Condition.createEmpty(),
        false,
      );
      const mockDef: FilterDefinition<Record<string, unknown>> = {
        canHandle: jest.fn(() => true),
        createOptionFetcher: jest.fn(),
        updateWhereQuery: jest.fn((query, el) => ({ ...query, [el.value.value]: "where" })),
      };
      const resolver = new FilterQueryVarsBuilderResolver([mockDef]);
      // Container includes a string and a valid element
      const builder = new QueryBuilder(
        QueryApiType.WHERE,
        ["notAFilter", element] as (string | FilterElement)[],
        [],
        resolver,
      );
      // Act
      const result = builder.build();

      // Assert
      expect(result.filters).toEqual({ foo: "where" });
    });

    it("should skip incompatible FilterElement items", () => {
      // Arrange
      const incompatible = { not: "a filter element" };
      const element = new FilterElement(
        new ExpressionValue("foo", "Foo", "foo"),
        Condition.createEmpty(),
        false,
      );
      const mockDef: FilterDefinition<Record<string, unknown>> = {
        canHandle: jest.fn(() => true),
        createOptionFetcher: jest.fn(),
        updateWhereQuery: jest.fn((query, el) => ({ ...query, [el.value.value]: "where" })),
      };
      const resolver = new FilterQueryVarsBuilderResolver([mockDef]);

      // Container includes an incompatible object and a valid element
      const builder = new QueryBuilder(
        QueryApiType.WHERE,
        [incompatible as unknown as FilterElement, element],
        [],
        resolver,
      );

      // Act
      const result = builder.build();

      // Assert
      expect(result.filters).toEqual({ foo: "where" });
    });

    it("should process valid FilterElement items", () => {
      // Arrange
      const element = new FilterElement(
        new ExpressionValue("foo", "Foo", "foo"),
        Condition.createEmpty(),
        false,
      );
      const mockDef: FilterDefinition<Record<string, unknown>> = {
        canHandle: jest.fn(() => true),
        createOptionFetcher: jest.fn(),
        updateWhereQuery: jest.fn((query, el) => ({ ...query, [el.value.value]: "where" })),
      };
      const resolver = new FilterQueryVarsBuilderResolver([mockDef]);
      const builder = new QueryBuilder(QueryApiType.WHERE, [element], [], resolver);
      // Act
      const result = builder.build();

      // Assert
      expect(result.filters).toEqual({ foo: "where" });
    });
  });

  describe("top-level key separation", () => {
    it("should correctly extract specified top-level keys", () => {
      // Arrange
      const element1 = new FilterElement(
        new ExpressionValue("foo", "Foo", "foo"),
        Condition.createEmpty(),
        false,
      );
      const element2 = new FilterElement(
        new ExpressionValue("channel", "Channel", "channel"),
        Condition.createEmpty(),
        false,
      );
      const mockDef: FilterDefinition<Record<string, unknown>> = {
        canHandle: jest.fn(() => true),
        createOptionFetcher: jest.fn(),
        updateWhereQuery: jest.fn((query, el) => ({ ...query, [el.value.value]: "where" })),
      };
      const resolver = new FilterQueryVarsBuilderResolver([mockDef]);
      // The query will have both foo and channel keys
      const builder = new QueryBuilder(
        QueryApiType.WHERE,
        [element1, element2],
        ["channel"],
        resolver,
      );

      // Act
      const result = builder.build();

      // Assert
      expect(result.topLevel).toEqual({ channel: "where" });
      expect(result.filters).toEqual({ foo: "where" });
    });

    it("should handle empty top-level keys array", () => {
      // Arrange
      const element = new FilterElement(
        new ExpressionValue("foo", "Foo", "foo"),
        Condition.createEmpty(),
        false,
      );
      const mockDef: FilterDefinition<Record<string, unknown>> = {
        canHandle: jest.fn(() => true),
        createOptionFetcher: jest.fn(),
        updateWhereQuery: jest.fn((query, el) => ({ ...query, [el.value.value]: "where" })),
      };
      const resolver = new FilterQueryVarsBuilderResolver([mockDef]);
      const builder = new QueryBuilder(QueryApiType.WHERE, [element], [], resolver);

      // Act
      const result = builder.build();

      // Assert
      expect(result.topLevel).toEqual({});
      expect(result.filters).toEqual({ foo: "where" });
    });

    it("should handle non-existent top-level keys", () => {
      // Arrange
      const element = new FilterElement(
        new ExpressionValue("foo", "Foo", "foo"),
        Condition.createEmpty(),
        false,
      );
      const mockDef: FilterDefinition<Record<string, unknown>> = {
        canHandle: jest.fn(() => true),
        createOptionFetcher: jest.fn(),
        updateWhereQuery: jest.fn((query, el) => ({ ...query, [el.value.value]: "where" })),
      };
      const resolver = new FilterQueryVarsBuilderResolver([mockDef]);
      // topLevelKeys includes a key not present in the query
      const builder = new QueryBuilder(QueryApiType.WHERE, [element], ["notPresent"], resolver);
      // Act
      const result = builder.build();

      // Assert
      expect(result.topLevel).toEqual({});
      expect(result.filters).toEqual({ foo: "where" });
    });
  });
});
