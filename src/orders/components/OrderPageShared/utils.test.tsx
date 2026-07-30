import { type OrderDetailsFragment } from "@dashboard/graphql";

import { createOrderMetadataIdSchema } from "./utils";

describe("createOrderMetadataIdSchema", () => {
  it("returns an empty metadata schema keyed by order and fulfillment ids", () => {
    // Metadata is loaded on demand by dedicated dialogs, so it is no longer part of
    // the eagerly fetched order details. The schema only keeps the id-keyed shape.
    // Arrange
    const order = {
      id: "some-order-id",
      fulfillments: [{ id: "some-fulfillment-id" }, { id: "another-fulfillment-id" }],
    };

    // Act
    const metadata = createOrderMetadataIdSchema(order as OrderDetailsFragment);

    // Assert
    expect(metadata).toEqual({
      "some-order-id": {
        metadata: [],
        privateMetadata: [],
      },
      "some-fulfillment-id": {
        metadata: [],
        privateMetadata: [],
      },
      "another-fulfillment-id": {
        metadata: [],
        privateMetadata: [],
      },
    });
  });
});
