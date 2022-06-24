import { ChannelData } from "@saleor/channels/utils";
import { act, renderHook } from "@testing-library/react-hooks";

import useChannels from "./useChannels";

const channels: ChannelData[] = [
  {
    id: "channel1",
    name: "Channel 1",
    variantsIds: ["variant1", "variant2"],
  },
  {
    id: "channel2",
    name: "Channel 2",
    variantsIds: [],
  },
];

describe("useChannels", () => {
  it("properly toggles channels", () => {
    // Given
    const { result } = renderHook(() =>
      useChannels(
        channels,
        "",
        {
          closeModal: jest.fn,
          openModal: jest.fn,
        },
        { formId: Symbol() },
      ),
    );

    // When
    act(() => {
      result.current.channelsToggle(channels[0]);
    });

    act(() => {
      result.current.handleChannelsConfirm();
    });

    // Then
    expect(result.current.currentChannels).toStrictEqual([channels[1]]);
    expect(result.current.currentChannels[0].id).toBe(channels[1].id);
  });
  it("properly removes channels", () => {
    // Given
    const { result } = renderHook(() =>
      useChannels(
        channels,
        "",
        {
          closeModal: jest.fn,
          openModal: jest.fn,
        },
        { formId: Symbol() },
      ),
    );

    // When
    act(() => {
      result.current.channelsToggle(channels[0]);
    });

    act(() => {
      result.current.channelsToggle(channels[1]);
    });

    act(() => {
      result.current.handleChannelsConfirm();
    });

    // Then
    expect(result.current.currentChannels).toStrictEqual([]);
  });

  it("doesn't not save changes if closed without confirm", () => {
    // Given
    const { result } = renderHook(() =>
      useChannels(
        channels,
        "",
        {
          closeModal: jest.fn,
          openModal: jest.fn,
        },
        { formId: Symbol() },
      ),
    );

    // When
    act(() => {
      result.current.channelsToggle(channels[0]);
    });

    act(() => {
      result.current.handleChannelsModalClose();
    });

    // Then
    expect(result.current.currentChannels).toStrictEqual(channels);
  });
});
