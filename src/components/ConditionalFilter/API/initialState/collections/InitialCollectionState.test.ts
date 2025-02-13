import { CollectionPublished } from "@dashboard/graphql";

import { UrlEntry, UrlToken } from "../../../ValueProvider/UrlToken";
import { InitialCollectionStateResponse } from "./InitialCollectionState";

describe("ConditionalFilter / API / Page / InitialCollectionStateResponse", () => {
  it("should filter by channel", () => {
    // Arrange
    const initialCollectionState = InitialCollectionStateResponse.empty();

    initialCollectionState.channel = [
      {
        label: "Channel 1",
        value: "chan-1",
        slug: "chan-1",
      },
      {
        label: "Channel 2",
        value: "chan-2",
        slug: "chan-2",
      },
    ];

    const token = UrlToken.fromUrlEntry(new UrlEntry("s0.channel", "chan-1"));
    const expectedOutput = [
      {
        label: "Channel 1",
        value: "chan-1",
        slug: "chan-1",
      },
    ];

    // Act
    const result = initialCollectionState.filterByUrlToken(token);

    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it("should filter by published", () => {
    // Arrange
    const initialCollectionState = InitialCollectionStateResponse.empty();

    initialCollectionState.published = [
      {
        label: CollectionPublished.PUBLISHED,
        value: CollectionPublished.PUBLISHED,
        slug: CollectionPublished.PUBLISHED,
      },
      {
        label: CollectionPublished.HIDDEN,
        value: CollectionPublished.HIDDEN,
        slug: CollectionPublished.HIDDEN,
      },
    ];

    const token = UrlToken.fromUrlEntry(new UrlEntry("s0.published", "HIDDEN"));
    const expectedOutput = [
      {
        label: CollectionPublished.HIDDEN,
        value: CollectionPublished.HIDDEN,
        slug: CollectionPublished.HIDDEN,
      },
    ];

    // Act
    const result = initialCollectionState.filterByUrlToken(token);

    // Assert
    expect(result).toEqual(expectedOutput);
  });
});
