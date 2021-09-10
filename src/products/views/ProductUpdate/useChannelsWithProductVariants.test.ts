import { ChannelData } from "@saleor/channels/utils";
import { act, renderHook } from "@testing-library/react-hooks";

import useChannelsWithProductVariants from "./useChannelsWithProductVariants";

const channels: ChannelData[] = [
  {
    id: "channel1",
    name: "Channel 1",
    variantsIds: ["variant1", "variant2"]
  }
];

const variants = [];

const setupHook = () =>
  renderHook(() => useChannelsWithProductVariants({ channels, variants }));

describe("useChannelsWithProductVariants", () => {
  it("properly initializes state", () => {
    const { result } = setupHook();

    expect(
      result.current.channelsWithVariantsData.channel1.selectedVariantsIds
    ).toHaveLength(2);
    expect(
      result.current.channelsWithVariantsData.channel1.variantsIdsToAdd
    ).toHaveLength(0);
    expect(
      result.current.channelsWithVariantsData.channel1.variantsIdsToRemove
    ).toHaveLength(0);
  });

  it("properly adds variants", () => {
    const { result } = setupHook();

    act(() => result.current.addVariantToChannel("channel1", "variant3"));

    expect(
      result.current.channelsWithVariantsData.channel1.selectedVariantsIds
    ).toHaveLength(3);
    expect(
      result.current.channelsWithVariantsData.channel1.variantsIdsToAdd
    ).toHaveLength(1);
    expect(
      result.current.channelsWithVariantsData.channel1.variantsIdsToRemove
    ).toHaveLength(0);
  });

  it("properly removes variants", () => {
    const { result } = setupHook();

    act(() => result.current.removeVariantFromChannel("channel1", "variant2"));

    expect(
      result.current.channelsWithVariantsData.channel1.selectedVariantsIds
    ).toHaveLength(1);
    expect(
      result.current.channelsWithVariantsData.channel1.variantsIdsToAdd
    ).toHaveLength(0);
    expect(
      result.current.channelsWithVariantsData.channel1.variantsIdsToRemove
    ).toHaveLength(1);
  });
});
