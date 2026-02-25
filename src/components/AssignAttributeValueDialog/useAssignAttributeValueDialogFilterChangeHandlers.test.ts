import {
  AttributeEntityTypeEnum,
  type CategoryFilterInput,
  type CollectionFilterInput,
  type PageWhereInput,
  type ProductWhereInput,
} from "@dashboard/graphql";
import { act, renderHook } from "@testing-library/react-hooks";

import { useAssignAttributeValueDialogFilterChangeHandlers } from "./useAssignAttributeValueDialogFilterChangeHandlers";

describe("useAssignAttributeValueDialogFilterChangeHandlers", () => {
  const setup = () => {
    const refetchProducts = jest.fn();
    const refetchPages = jest.fn();
    const refetchCategories = jest.fn();
    const refetchCollections = jest.fn();
    const { result } = renderHook(() =>
      useAssignAttributeValueDialogFilterChangeHandlers({
        refetchProducts,
        refetchPages,
        refetchCategories,
        refetchCollections,
      }),
    );

    return {
      result,
      refetchProducts,
      refetchPages,
      refetchCategories,
      refetchCollections,
    };
  };

  it("provides handlers for every supported entity type", () => {
    // Arrange
    const { result } = setup();

    expect(result.current[AttributeEntityTypeEnum.PRODUCT]).toBeInstanceOf(Function);
    expect(result.current[AttributeEntityTypeEnum.PRODUCT_VARIANT]).toBeInstanceOf(Function);
    expect(result.current[AttributeEntityTypeEnum.PAGE]).toBeInstanceOf(Function);
    expect(result.current[AttributeEntityTypeEnum.CATEGORY]).toBeInstanceOf(Function);
    expect(result.current[AttributeEntityTypeEnum.COLLECTION]).toBeInstanceOf(Function);
  });

  it("wires product and product variant handlers to product refetch", () => {
    // Arrange
    const { result, refetchProducts } = setup();
    const where: ProductWhereInput = {
      ids: ["prod-1"],
    };

    // Act
    act(() => {
      result.current[AttributeEntityTypeEnum.PRODUCT](where, "channel-usd", "hoodie");
      result.current[AttributeEntityTypeEnum.PRODUCT_VARIANT](where, undefined, "sneaker");
    });

    // Assert
    expect(refetchProducts).toHaveBeenCalledTimes(2);
    expect(refetchProducts).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ where, channel: "channel-usd", query: "hoodie" }),
    );
    expect(refetchProducts).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ where, channel: undefined, query: "sneaker" }),
    );
  });

  it("wires page handler to page refetch", () => {
    // Arrange
    const { result, refetchPages } = setup();
    const where: PageWhereInput = {
      ids: ["page-1"],
    };

    // Act
    act(() => {
      result.current[AttributeEntityTypeEnum.PAGE](where, "landing");
    });

    // Assert
    expect(refetchPages).toHaveBeenCalledWith(expect.objectContaining({ where, query: "landing" }));
  });

  it("wires category handler to category refetch", () => {
    // Arrange
    const { result, refetchCategories } = setup();
    const filterVariables: CategoryFilterInput = {
      ids: ["cat-1"],
    };

    // Act
    act(() => {
      result.current[AttributeEntityTypeEnum.CATEGORY](filterVariables, "winter");
    });

    // Assert
    expect(refetchCategories).toHaveBeenCalledWith(
      expect.objectContaining({
        filter: expect.objectContaining({ ...filterVariables, search: "winter" }),
      }),
    );
  });

  it("wires collection handler to collection refetch", () => {
    // Arrange
    const { result, refetchCollections } = setup();
    const filterVariables: CollectionFilterInput = {
      ids: ["col-1"],
    };

    // Act
    act(() => {
      result.current[AttributeEntityTypeEnum.COLLECTION](filterVariables, "channel-eur", "drops");
    });

    // Assert
    expect(refetchCollections).toHaveBeenCalledWith(
      expect.objectContaining({
        channel: "channel-eur",
        filter: expect.objectContaining({ ...filterVariables, search: "drops" }),
      }),
    );
  });
});
