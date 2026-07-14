import { type ChannelData } from "@dashboard/channels/utils";
import { act, renderHook } from "@testing-library/react";

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
        { formId: Symbol("channel-test-form-id") },
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
        { formId: Symbol("channel-test-form-id") },
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
        { formId: Symbol("channel-test-form-id") },
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

  it("does not update channels when confirming an unchanged selection", () => {
    // Given
    const closeModal = jest.fn();
    const { result } = renderHook(() =>
      useChannels(
        channels,
        "",
        {
          closeModal,
          openModal: jest.fn(),
        },
        { formId: Symbol("channel-test-form-id") },
      ),
    );
    const channelsBefore = result.current.currentChannels;

    // When
    act(() => {
      result.current.handleChannelsConfirm();
    });

    // Then
    expect(result.current.currentChannels).toBe(channelsBefore);
    expect(closeModal).toHaveBeenCalled();
  });

  it("reports unchanged selection as not dirty", () => {
    // Given
    const { result } = renderHook(() =>
      useChannels(
        channels,
        "",
        {
          closeModal: jest.fn(),
          openModal: jest.fn(),
        },
        { formId: Symbol("channel-test-form-id") },
      ),
    );

    // Then
    expect(result.current.hasChannelSelectionChanged).toBe(false);
  });

  it("reports changed selection as dirty", () => {
    // Given
    const { result } = renderHook(() =>
      useChannels(
        channels,
        "",
        {
          closeModal: jest.fn(),
          openModal: jest.fn(),
        },
        { formId: Symbol("channel-test-form-id") },
      ),
    );

    // When
    act(() => {
      result.current.channelsToggle(channels[0]);
    });

    // Then
    expect(result.current.hasChannelSelectionChanged).toBe(true);
  });

  it("resets dirty state after confirming changes", () => {
    // Given
    const { result } = renderHook(() =>
      useChannels(
        channels,
        "",
        {
          closeModal: jest.fn(),
          openModal: jest.fn(),
        },
        { formId: Symbol("channel-test-form-id") },
      ),
    );

    act(() => {
      result.current.channelsToggle(channels[0]);
    });

    // When
    act(() => {
      result.current.handleChannelsConfirm();
    });

    // Then
    expect(result.current.hasChannelSelectionChanged).toBe(false);
  });

  it("resets dirty state when closing without confirm", () => {
    // Given
    const { result } = renderHook(() =>
      useChannels(
        channels,
        "",
        {
          closeModal: jest.fn(),
          openModal: jest.fn(),
        },
        { formId: Symbol("channel-test-form-id") },
      ),
    );

    act(() => {
      result.current.channelsToggle(channels[0]);
    });

    // When
    act(() => {
      result.current.handleChannelsModalClose();
    });

    // Then
    expect(result.current.hasChannelSelectionChanged).toBe(false);
  });

  it("handles undefined initial channels", () => {
    // Given
    const { result } = renderHook(() =>
      useChannels(
        undefined,
        "",
        {
          closeModal: jest.fn(),
          openModal: jest.fn(),
        },
        { formId: Symbol("channel-test-form-id") },
      ),
    );

    // Then
    expect(result.current.currentChannels).toStrictEqual([]);
    expect(result.current.hasChannelSelectionChanged).toBe(false);
  });
});
