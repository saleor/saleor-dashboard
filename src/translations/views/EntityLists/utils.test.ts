import { ShippingMethodTranslationsQuery } from "@dashboard/graphql";

import { mapTranslationsToEntities } from "./utils";

describe("mapTranslationsToEntities", () => {
  it("should return empty array if data is undefined", () => {
    // Arrange
    const data = undefined;

    // Act
    const result = mapTranslationsToEntities(data);

    // Assert
    expect(result).toEqual([]);
  });

  it("should return empty array if translations is undefined", () => {
    // Arrange
    const data = {
      translations: undefined,
    } as unknown as ShippingMethodTranslationsQuery;

    // Act
    const result = mapTranslationsToEntities(data);

    // Assert
    expect(result).toEqual([]);
  });

  it("should return empty array if items is undefined", () => {
    // Arrange
    const data = {
      translations: {
        edges: undefined,
      },
    } as unknown as ShippingMethodTranslationsQuery;

    // Act
    const result = mapTranslationsToEntities(data);

    // Assert
    expect(result).toEqual([]);
  });

  it("should return correct array", () => {
    // Arrange
    const data = {
      translations: {
        edges: [
          {
            node: {
              __typename: "ShippingMethodTranslatableContent",
              translation: {
                name: "name",
                description: "description",
              },
              shippingMethod: {
                id: "id",
              },
              name: "name",
            },
          },
        ],
      },
    } as ShippingMethodTranslationsQuery;

    // Act
    const result = mapTranslationsToEntities(data);

    // Assert
    expect(result).toEqual([
      {
        completion: {
          current: 2,
          max: 2,
        },
        id: "id",
        name: "name",
      },
    ]);
  });

  it("should return empty string when no shipping method", () => {
    // Arrange
    const data = {
      translations: {
        edges: [
          {
            node: {
              __typename: "ShippingMethodTranslatableContent",
              translation: {
                name: "name",
                description: "description",
              },
              name: "name",
            },
          },
        ],
      },
    } as ShippingMethodTranslationsQuery;

    // Act
    const result = mapTranslationsToEntities(data);

    // Assert
    expect(result).toEqual([
      {
        completion: {
          current: 2,
          max: 2,
        },
        id: "",
        name: "name",
      },
    ]);
  });
});
