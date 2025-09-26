import { Condition } from "../FilterElement/Condition";
import { ExpressionValue, FilterElement } from "../FilterElement/FilterElement";
import { FilterQueryVarsBuilderResolver } from "./FilterQueryVarsBuilderResolver";
import { FiltersQueryBuilder } from "./FiltersQueryBuilder";
import { QueryVarsBuilder } from "./queryVarsBuilders/types";
import { QueryApiType } from "./types";

describe("FiltersQueryBuilder", () => {
  describe("build for WHERE API", () => {
    it("should build empty query for empty filter container", () => {
      // Arrange
      const container: FilterElement[] = [];
      const builder = new FiltersQueryBuilder({
        apiType: QueryApiType.WHERE,
        filterContainer: container,
      });

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
      const mockDef: QueryVarsBuilder<Record<string, unknown>> = {
        canHandle: jest.fn(() => true),
        createOptionFetcher: jest.fn(),
        updateWhereQueryVariables: jest.fn((query, el) => ({
          ...query,
          [el.value.value]: "where",
        })),
      };
      const resolver = new FilterQueryVarsBuilderResolver([mockDef]);
      const builder = new FiltersQueryBuilder({
        apiType: QueryApiType.WHERE,
        filterContainer: [element],
        topLevelKeys: [],
        filterDefinitionResolver: resolver,
      });

      // Act
      const result = builder.build();

      // Assert
      expect(result.filters).toEqual({ foo: "where" });
      expect(result.topLevel).toEqual({});
      expect(mockDef.updateWhereQueryVariables as jest.Mock).toHaveBeenCalled();
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
      const mockDef: QueryVarsBuilder<Record<string, unknown>> = {
        canHandle: jest.fn(() => true),
        createOptionFetcher: jest.fn(),
        updateWhereQueryVariables: jest.fn((query, el) => ({
          ...query,
          [el.value.value]: "where",
        })),
      };
      const resolver = new FilterQueryVarsBuilderResolver([mockDef]);
      const builder = new FiltersQueryBuilder({
        apiType: QueryApiType.WHERE,
        filterContainer: [element1, element2],
        topLevelKeys: [],
        filterDefinitionResolver: resolver,
      });

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
        // no updateWhereQueryVariables property
      } as unknown as QueryVarsBuilder<Record<string, unknown>>;
      const resolver = new FilterQueryVarsBuilderResolver([mockDef]);
      const builder = new FiltersQueryBuilder({
        apiType: QueryApiType.WHERE,
        filterContainer: [element],
        topLevelKeys: [],
        filterDefinitionResolver: resolver,
      });

      // Act & Assert
      expect(() => builder.build()).toThrow(/does not support WHERE API/);
    });
  });

  describe("build for FILTER API", () => {
    it("should build empty query for empty filter container", () => {
      // Arrange
      const container: FilterElement[] = [];
      const builder = new FiltersQueryBuilder({
        apiType: QueryApiType.FILTER,
        filterContainer: container,
      });

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
      const mockDef: QueryVarsBuilder<Record<string, unknown>> = {
        canHandle: jest.fn(() => true),
        createOptionFetcher: jest.fn(),
        updateFilterQueryVariables: jest.fn((query, el) => ({
          ...query,
          [el.value.value]: "filter",
        })),
      };
      const resolver = new FilterQueryVarsBuilderResolver([mockDef]);
      const builder = new FiltersQueryBuilder({
        apiType: QueryApiType.FILTER,
        filterContainer: [element],
        topLevelKeys: [],
        filterDefinitionResolver: resolver,
      });

      // Act
      const result = builder.build();

      // Assert
      expect(result.filters).toEqual({ foo: "filter" });
      expect(result.topLevel).toEqual({});
      expect(mockDef.updateFilterQueryVariables as jest.Mock).toHaveBeenCalled();
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
      const mockDef: QueryVarsBuilder<Record<string, unknown>> = {
        canHandle: jest.fn(() => true),
        createOptionFetcher: jest.fn(),
        updateFilterQueryVariables: jest.fn((query, el) => ({
          ...query,
          [el.value.value]: "filter",
        })),
      };
      const resolver = new FilterQueryVarsBuilderResolver([mockDef]);
      const builder = new FiltersQueryBuilder({
        apiType: QueryApiType.FILTER,
        filterContainer: [element1, element2],
        topLevelKeys: [],
        filterDefinitionResolver: resolver,
      });
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
        // no updateFilterQueryVariables property
      } as unknown as QueryVarsBuilder<Record<string, unknown>>;
      const resolver = new FilterQueryVarsBuilderResolver([mockDef]);
      const builder = new FiltersQueryBuilder({
        apiType: QueryApiType.FILTER,
        filterContainer: [element],
        topLevelKeys: [],
        filterDefinitionResolver: resolver,
      });

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
      const mockDef: QueryVarsBuilder<Record<string, unknown>> = {
        canHandle: jest.fn(() => true),
        createOptionFetcher: jest.fn(),
        updateWhereQueryVariables: jest.fn((query, el) => ({
          ...query,
          [el.value.value]: "where",
        })),
      };
      const resolver = new FilterQueryVarsBuilderResolver([mockDef]);
      // Container includes a string and a valid element
      const builder = new FiltersQueryBuilder({
        apiType: QueryApiType.WHERE,
        filterContainer: ["notAFilter", element] as (string | FilterElement)[],
        topLevelKeys: [],
        filterDefinitionResolver: resolver,
      });
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
      const mockDef: QueryVarsBuilder<Record<string, unknown>> = {
        canHandle: jest.fn(() => true),
        createOptionFetcher: jest.fn(),
        updateWhereQueryVariables: jest.fn((query, el) => ({
          ...query,
          [el.value.value]: "where",
        })),
      };
      const resolver = new FilterQueryVarsBuilderResolver([mockDef]);

      // Container includes an incompatible object and a valid element
      const builder = new FiltersQueryBuilder({
        apiType: QueryApiType.WHERE,
        filterContainer: [incompatible as unknown as FilterElement, element],
        topLevelKeys: [],
        filterDefinitionResolver: resolver,
      });

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
      const mockDef: QueryVarsBuilder<Record<string, unknown>> = {
        canHandle: jest.fn(() => true),
        createOptionFetcher: jest.fn(),
        updateWhereQueryVariables: jest.fn((query, el) => ({
          ...query,
          [el.value.value]: "where",
        })),
      };
      const resolver = new FilterQueryVarsBuilderResolver([mockDef]);
      const builder = new FiltersQueryBuilder({
        apiType: QueryApiType.WHERE,
        filterContainer: [element],
        topLevelKeys: [],
        filterDefinitionResolver: resolver,
      });
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
      const mockDef: QueryVarsBuilder<Record<string, unknown>> = {
        canHandle: jest.fn(() => true),
        createOptionFetcher: jest.fn(),
        updateWhereQueryVariables: jest.fn((query, el) => ({
          ...query,
          [el.value.value]: "where",
        })),
      };
      const resolver = new FilterQueryVarsBuilderResolver([mockDef]);
      // The query will have both foo and channel keys
      const builder = new FiltersQueryBuilder({
        apiType: QueryApiType.WHERE,
        filterContainer: [element1, element2],
        topLevelKeys: ["channel"],
        filterDefinitionResolver: resolver,
      });

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
      const mockDef: QueryVarsBuilder<Record<string, unknown>> = {
        canHandle: jest.fn(() => true),
        createOptionFetcher: jest.fn(),
        updateWhereQueryVariables: jest.fn((query, el) => ({
          ...query,
          [el.value.value]: "where",
        })),
      };
      const resolver = new FilterQueryVarsBuilderResolver([mockDef]);
      const builder = new FiltersQueryBuilder({
        apiType: QueryApiType.WHERE,
        filterContainer: [element],
        topLevelKeys: [],
        filterDefinitionResolver: resolver,
      });

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
      const mockDef: QueryVarsBuilder<Record<string, unknown>> = {
        canHandle: jest.fn(() => true),
        createOptionFetcher: jest.fn(),
        updateWhereQueryVariables: jest.fn((query, el) => ({
          ...query,
          [el.value.value]: "where",
        })),
      };
      const resolver = new FilterQueryVarsBuilderResolver([mockDef]);
      // topLevelKeys includes a key not present in the query
      const builder = new FiltersQueryBuilder({
        apiType: QueryApiType.WHERE,
        filterContainer: [element],
        topLevelKeys: ["notPresent"],
        filterDefinitionResolver: resolver,
      });
      // Act
      const result = builder.build();

      // Assert
      expect(result.topLevel).toEqual({});
      expect(result.filters).toEqual({ foo: "where" });
    });
  });

  describe("useAndWrapper option", () => {
    it("should wrap all root fields in AND array when useAndWrapper is true", () => {
      // Arrange
      const element1 = new FilterElement(
        new ExpressionValue("status", "Status", "status"),
        Condition.createEmpty(),
        false,
      );
      const element2 = new FilterElement(
        new ExpressionValue("channelId", "Channel", "channelId"),
        Condition.createEmpty(),
        false,
      );
      const mockQueryVarsBuilder: QueryVarsBuilder<Record<string, unknown>> = {
        canHandle: jest.fn(() => true),
        createOptionFetcher: jest.fn(),
        updateWhereQueryVariables: jest.fn((query, el) => ({
          ...query,
          [el.value.value]: { eq: "test" },
        })),
      };
      const resolver = new FilterQueryVarsBuilderResolver([mockQueryVarsBuilder]);
      const builder = new FiltersQueryBuilder({
        apiType: QueryApiType.WHERE,
        filterContainer: [element1, element2],
        useAndWrapper: true,
        filterDefinitionResolver: resolver,
      });

      // Act
      const result = builder.build();

      // Assert
      expect(result.filters).toEqual({
        AND: [{ status: { eq: "test" } }, { channelId: { eq: "test" } }],
      });
    });

    it("should merge existing AND items with wrapped root fields", () => {
      // Arrange
      const element1 = new FilterElement(
        new ExpressionValue("status", "Status", "status"),
        Condition.createEmpty(),
        false,
      );

      // Mock a mocked query vars builder definition that adds to
      // AND array (like MetadataFilterInputQueryVarsBuilder)
      type QueryWithAnd = { AND?: Array<Record<string, unknown>> };

      const mockDefWithAnd: QueryVarsBuilder<QueryWithAnd> = {
        canHandle: jest.fn(el => el.value.value === "metadata"),
        createOptionFetcher: jest.fn(),
        updateWhereQueryVariables: jest.fn((query: QueryWithAnd) => ({
          ...query,
          AND: [...(query.AND || []), { metadata: { key: "color", value: { eq: "red" } } }],
        })),
      };
      const mockDefTopLevelKey: QueryVarsBuilder<QueryWithAnd> = {
        canHandle: jest.fn(el => el.value.value === "status"),
        createOptionFetcher: jest.fn(),
        updateWhereQueryVariables: jest.fn(query => ({
          ...query,
          status: { eq: "PAID" },
        })),
      };
      const element2 = new FilterElement(
        new ExpressionValue("metadata", "Metadata", "metadata"),
        Condition.createEmpty(),
        false,
      );
      const resolver = new FilterQueryVarsBuilderResolver<QueryWithAnd>([
        mockDefWithAnd,
        mockDefTopLevelKey,
      ]);
      const builder = new FiltersQueryBuilder({
        apiType: QueryApiType.WHERE,
        filterContainer: [element1, element2],
        useAndWrapper: true,
        filterDefinitionResolver: resolver,
      });

      // Act
      const result = builder.build();

      // Assert
      expect(result.filters).toEqual({
        AND: [{ metadata: { key: "color", value: { eq: "red" } } }, { status: { eq: "PAID" } }],
      });
    });

    it("should return empty object when no fields to wrap", () => {
      // Arrange
      const builder = new FiltersQueryBuilder({
        apiType: QueryApiType.WHERE,
        filterContainer: [],
        useAndWrapper: true,
      });

      // Act
      const result = builder.build();

      // Assert
      expect(result.filters).toEqual({});
    });

    it("should exclude OR operators from being wrapped", () => {
      // Arrange
      const element = new FilterElement(
        new ExpressionValue("status", "Status", "status"),
        Condition.createEmpty(),
        false,
      );
      const mockDef: QueryVarsBuilder<Record<string, unknown>> = {
        canHandle: jest.fn(() => true),
        createOptionFetcher: jest.fn(),
        updateWhereQueryVariables: jest.fn(() => ({
          status: { eq: "PAID" },
          OR: [{ channelId: { eq: "123" } }, { channelId: { eq: "456" } }],
        })),
      };
      const resolver = new FilterQueryVarsBuilderResolver([mockDef]);
      const builder = new FiltersQueryBuilder({
        apiType: QueryApiType.WHERE,
        filterContainer: [element],
        useAndWrapper: true,
        filterDefinitionResolver: resolver,
      });

      // Act
      const result = builder.build();

      // Assert
      expect(result.filters).toStrictEqual({
        AND: [{ status: { eq: "PAID" } }],
        OR: [{ channelId: { eq: "123" } }, { channelId: { eq: "456" } }],
      });
    });
  });
});
