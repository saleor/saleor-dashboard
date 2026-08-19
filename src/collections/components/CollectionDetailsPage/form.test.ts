import { type ChannelCollectionData } from "@dashboard/channels/utils";
import { type CollectionDetailsFragment } from "@dashboard/graphql";
import { act, renderHook } from "@testing-library/react";

import { useCollectionUpdateForm } from "./form";
import { hasCollectionSaveComposition } from "./saveComposition";

jest.mock("@dashboard/utils/richText/useRichText", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    getValue: jest.fn(),
    isDirty: false,
  })),
}));

const savedChannelListings: ChannelCollectionData[] = [
  {
    id: "channel-1",
    name: "Channel",
    isPublished: true,
    publishedAt: null,
  },
];

const collection = {
  id: "collection-1",
  name: "Summer",
  slug: "summer",
  seoTitle: "",
  seoDescription: "",
  backgroundImage: null,
  description: null,
} as unknown as CollectionDetailsFragment;

describe("useCollectionUpdateForm", () => {
  it("disables Save when the form is pristine", () => {
    // Arrange
    const { result } = renderHook(() =>
      useCollectionUpdateForm(
        collection,
        savedChannelListings,
        savedChannelListings,
        jest.fn(),
        jest.fn(),
        false,
      ),
    );

    // Assert
    expect(result.current.isSaveDisabled).toBe(true);
    expect(hasCollectionSaveComposition(result.current.saveComposition)).toBe(false);
  });

  it("enables Save when general fields change", () => {
    // Arrange
    const { result } = renderHook(() =>
      useCollectionUpdateForm(
        collection,
        savedChannelListings,
        savedChannelListings,
        jest.fn(),
        jest.fn(),
        false,
      ),
    );

    // Act
    act(() => {
      result.current.change({
        target: {
          name: "name",
          value: "Winter",
        },
      });
    });

    // Assert
    expect(result.current.isSaveDisabled).toBe(false);
    expect(result.current.saveComposition.hasGeneral).toBe(true);
  });

  it("disables Save when the name is cleared", () => {
    // Arrange
    const { result } = renderHook(() =>
      useCollectionUpdateForm(
        collection,
        savedChannelListings,
        savedChannelListings,
        jest.fn(),
        jest.fn(),
        false,
      ),
    );

    // Act
    act(() => {
      result.current.change({
        target: {
          name: "name",
          value: "",
        },
      });
    });

    // Assert
    expect(result.current.isSaveDisabled).toBe(true);
  });

  it("enables Save when channel listings differ from baseline", () => {
    // Arrange
    const setChannels = jest.fn();
    const updatedChannels = [{ ...savedChannelListings[0], isPublished: false }];
    const { result, rerender } = renderHook(
      ({ channels }) =>
        useCollectionUpdateForm(
          collection,
          channels,
          savedChannelListings,
          setChannels,
          jest.fn(),
          false,
        ),
      { initialProps: { channels: savedChannelListings } },
    );

    // Act
    act(() => {
      result.current.handlers.changeChannels("channel-1", {
        isPublished: false,
        publishedAt: null,
      });
    });
    rerender({ channels: updatedChannels });

    // Assert
    expect(setChannels).toHaveBeenCalled();
    expect(result.current.saveComposition.hasChannels).toBe(true);
    expect(result.current.isSaveDisabled).toBe(false);
  });

  it("disables Save when a channel change is reverted to the baseline", () => {
    // Arrange
    const setChannels = jest.fn();
    const savedWithDate: ChannelCollectionData[] = [
      {
        ...savedChannelListings[0],
        publishedAt: "2024-06-01T10:00:00Z",
      },
    ];
    const updatedChannels: ChannelCollectionData[] = [
      { ...savedWithDate[0], isPublished: false, publishedAt: null },
    ];
    const { result, rerender } = renderHook(
      ({ channels }) =>
        useCollectionUpdateForm(collection, channels, savedWithDate, setChannels, jest.fn(), false),
      { initialProps: { channels: savedWithDate } },
    );

    // Act — unpublish
    act(() => {
      result.current.handlers.changeChannels("channel-1", {
        isPublished: false,
        publishedAt: null,
      });
    });
    rerender({ channels: updatedChannels });
    // Act — republish with restored saved date (matches product PublishedSection behavior)
    act(() => {
      result.current.handlers.changeChannels("channel-1", {
        isPublished: true,
        publishedAt: "2024-06-01T10:00:00Z",
      });
    });
    rerender({ channels: savedWithDate });

    // Assert
    expect(result.current.saveComposition.hasChannels).toBe(false);
    expect(result.current.isSaveDisabled).toBe(true);
  });
});
