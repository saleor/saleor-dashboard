import { OrderDetailsFragment } from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";

import {
  createMetadataHandler,
  createOrderMetadataIdSchema,
  filteredConditionalItems,
} from "./utils";

describe("filteredConditionalItems", () => {
  it("should return empty [] when no items has shouldExist set to true", () => {
    const items = [
      {
        item: { id: "#1" },
        shouldExist: false,
      },
      {
        item: { id: "#2" },
        shouldExist: false,
      },
      {
        item: { id: "#3" },
        shouldExist: false,
      },
    ];

    expect(filteredConditionalItems(items)).toEqual([]);
  });
  it("should return only items that has shouldExist set to true", () => {
    const items = [
      {
        item: { id: "#1" },
        shouldExist: false,
      },
      {
        item: { id: "#2" },
        shouldExist: true,
      },
      {
        item: { id: "#3" },
        shouldExist: true,
      },
    ];

    expect(filteredConditionalItems(items)).toEqual([{ id: "#2" }, { id: "#3" }]);
  });
});
describe("createOrderMetadataIdSchema", () => {
  it("returns order and fulfilment metadata", () => {
    // Arrange
    const order = {
      id: "some-order-id",
      metadata: [{ key: "mt1", value: "mt1-value" }],
      privateMetadata: [{ key: "pmt1", value: "pmt1-value" }],
      fulfillments: [
        {
          id: "some-fulfillment-id",
          metadata: [{ key: "fmt1", value: "fmt1-value" }],
          privateMetadata: [{ key: "fpmt1", value: "fpmt1-value" }],
        },
        {
          id: "some-fulfillment-id",
          metadata: [{ key: "fmt1", value: "fmt1-value" }],
          privateMetadata: [{ key: "fpmt1", value: "fpmt1-value" }],
        },
      ],
    };
    // Act
    const metadata = createOrderMetadataIdSchema(order as OrderDetailsFragment);

    // Assert
    expect(metadata).toEqual({
      "some-fulfillment-id": {
        metadata: [
          {
            key: "fmt1",
            value: "fmt1-value",
          },
        ],
        privateMetadata: [
          {
            key: "fpmt1",
            value: "fpmt1-value",
          },
        ],
      },
      "some-order-id": {
        metadata: [
          {
            key: "mt1",
            value: "mt1-value",
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
