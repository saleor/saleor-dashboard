import { ProductFragment } from "@saleor/graphql";
import { ProductUpdateSubmitData } from "@saleor/products/components/ProductUpdatePage/types";

import { inferProductChannelsAfterUpdate } from "./utils";

describe("Product update utils", () => {
  it("should infer product channels after update with data", () => {
    const product = {
      channelListings: [
        {
          channel: {
            id: "1",
          },
        },
        {
          channel: {
            id: "2",
          },
        },
        {
          channel: {
            id: "3",
          },
        },
      ],
    } as ProductFragment;

    const submitData = {
      channels: {
        updateChannels: [
          {
            channelId: "1",
          },
          {
            channelId: "4",
          },
        ],
        removeChannels: ["2"],
      },
    } as ProductUpdateSubmitData;

    const result = inferProductChannelsAfterUpdate(product, submitData);

    expect(result).toEqual(["1", "3", "4"]);
  });

  it("should infer product channels after update without data", () => {
    const product = {
      channelListings: [
        {
          channel: {
            id: "1",
          },
        },
        {
          channel: {
            id: "2",
          },
        },
        {
          channel: {
            id: "3",
          },
        },
      ],
    } as ProductFragment;

    const submitData = {
      channels: {},
    } as ProductUpdateSubmitData;

    const result = inferProductChannelsAfterUpdate(product, submitData);

    expect(result).toEqual(["1", "2", "3"]);
  });
});
