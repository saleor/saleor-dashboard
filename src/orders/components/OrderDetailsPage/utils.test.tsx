import { type OrderDetailsFragment } from "@dashboard/graphql";
import { type ChangeEvent } from "@dashboard/hooks/useForm";

import { createMetadataHandler, createOrderMetadataIdSchema } from "./utils";

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
describe("createMetadataHandler", () => {
  it("handles order metadata change", () => {
    // Arrange
    const currentData = {
      "some-order-id": {
        metadata: [{ key: "mt1", value: "mt1-value" }],
        privateMetadata: [{ key: "pmt1", value: "pmt1-value" }],
      },
      "some-fulfillment-id": {
        metadata: [{ key: "fmt1", value: "fmt1-value" }],
        privateMetadata: [{ key: "fpmt1", value: "fpmt1-value" }],
      },
    };
    const set = jest.fn();
    const triggerChange = jest.fn();
    const handler = createMetadataHandler(currentData, set, triggerChange);

    // Act
    handler(
      {
        target: {
          name: "metadata",
          value: [{ key: "new-key", value: "new-value" }],
        },
      } as ChangeEvent,
      "some-order-id",
    );
    // Assert
    expect(set).toHaveBeenCalledWith({
      "some-order-id": {
        metadata: [
          {
            key: "new-key",
            value: "new-value",
          },
        ],
        privateMetadata: [
          {
            key: "pmt1",
            value: "pmt1-value",
          },
        ],
      },
    });
    expect(triggerChange).toBeCalled();
  });
});
