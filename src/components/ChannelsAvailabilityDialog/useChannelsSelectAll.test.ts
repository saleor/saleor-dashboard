import { act, renderHook } from "@testing-library/react";

import { useChannelsSelectAll } from "./useChannelsSelectAll";

const channels = [
  { id: "1", name: "Alpha" },
  { id: "2", name: "Beta" },
  { id: "3", name: "Gamma" },
];

describe("useChannelsSelectAll", () => {
  it("selects only visible filtered channels when search is active", () => {
    // Arrange
    const onChange = jest.fn();
    const toggleAll = jest.fn();
    const filteredChannels = [channels[0]];
    const { result } = renderHook(() =>
      useChannelsSelectAll({
        channels,
        filteredChannels,
        query: "alp",
        isSelected: () => false,
        onChange,
        selected: 0,
        toggleAll,
      }),
    );

    // Act
    act(() => {
      result.current.handleToggleAll();
    });

    // Assert
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(channels[0]);
    expect(toggleAll).not.toHaveBeenCalled();
  });

  it("delegates to toggleAll when search is inactive", () => {
    // Arrange
    const onChange = jest.fn();
    const toggleAll = jest.fn();
    const { result } = renderHook(() =>
      useChannelsSelectAll({
        channels,
        filteredChannels: channels,
        query: "",
        isSelected: () => false,
        onChange,
        selected: 0,
        toggleAll,
      }),
    );

    // Act
    act(() => {
      result.current.handleToggleAll();
    });

    // Assert
    expect(toggleAll).toHaveBeenCalledWith(channels, 0);
    expect(onChange).not.toHaveBeenCalled();
  });
});
