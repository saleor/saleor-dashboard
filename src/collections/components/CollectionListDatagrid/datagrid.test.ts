import { Collection } from "@dashboard/collections/types";
import { CollectionChannels } from "@dashboard/components/ChannelsAvailabilityDropdown/utils";
import { getStatusColor } from "@dashboard/misc";
import { IntlShape } from "react-intl";

import { getAvailabilityLabel, getAvailabilityLabelWhenSelectedChannel } from "./datagrid";

const currentTheme = "defaultLight";
const intl = {
  formatMessage: jest.fn(x => x.defaultMessage),
} as unknown as IntlShape;

describe("CollectionListDatagrid datagrid utils", () => {
  beforeAll(() => {
    // Mock CSS.supports to enable OKLCH strings output
    global.CSS = {
      supports: () => true,
      escape: (s: string) => s,
    } as any;
  });

  describe("getAvailabilityLabelWhenSelectedChannel", () => {
    it("should return published label when channel is active", () => {
      // Arrange
      const channel = {
        __typename: "CollectionChannelListing",
        channel: {
          __typename: "Channel",
          id: "223",
          name: "Channel",
        },
        isPublished: true,
        publishedAt: null,
      } as CollectionChannels;
      // Act;
      const result = getAvailabilityLabelWhenSelectedChannel(channel, intl, currentTheme);

      // Assert
      expect(result).toEqual({
        color: getStatusColor({ status: "success", currentTheme }).base,
        label: "Published",
      });
    });
    it("should return unpublished label when channel is not active", () => {
      // Arrange
      const channel = {
        __typename: "CollectionChannelListing",
        channel: {
          __typename: "Channel",
          id: "223",
          name: "Channel",
        },
        isPublished: false,
        publishedAt: null,
      } as CollectionChannels;
      // Act;
      const result = getAvailabilityLabelWhenSelectedChannel(channel, intl, currentTheme);

      // Assert
      expect(result).toEqual({
        color: getStatusColor({ status: "error", currentTheme }).base,
        label: "Unpublished",
      });
    });
    it("should return Scheduled to publish label when channel is not active but has scheduled dat", () => {
      // Arrange
      const channel = {
        __typename: "CollectionChannelListing",
        channel: {
          __typename: "Channel",
          id: "223",
          name: "Channel",
        },
        isPublished: false,
        publishedAt: "2021-09-09T12:00:00+00:00",
      } as CollectionChannels;
      // Act;
      const result = getAvailabilityLabelWhenSelectedChannel(channel, intl, currentTheme);

      // Assert
      expect(result).toEqual({
        color: getStatusColor({ status: "warning", currentTheme }).base,
        label: "Scheduled to publish",
      });
    });
  });
  describe("getAvailabilityLabel", () => {
    it("should return no channels label when there is not channels in collection", () => {
      // Arrange
      const collection = {
        channelListings: [],
      } as unknown as Collection;
      // Act
      const result = getAvailabilityLabel(collection, intl, currentTheme);

      // Assert
      expect(result).toEqual({
        color: getStatusColor({ status: "error", currentTheme }).base,
        label: "No channels",
      });
    });
    it("should return label with color when there are some channels in collection and are active", () => {
      // Arrange
      const collection = {
        channelListings: [
          {
            __typename: "CollectionChannelListing",
            channel: {
              __typename: "Channel",
              id: "223",
              name: "Channel",
            },
            isPublished: true,
            publishedAt: null,
          },
        ],
      } as unknown as Collection;
      // Act
      const result = getAvailabilityLabel(collection, intl, currentTheme);

      // Assert
      expect(result).toEqual({
        color: getStatusColor({ status: "success", currentTheme }).base,
        label: "{channelCount} {channelCount,plural, =1 {Channel} other {Channels}}",
      });
    });
    it("should return label with error color when there are some channels in collection but are not active", () => {
      // Arrange
      const collection = {
        channelListings: [
          {
            __typename: "CollectionChannelListing",
            channel: {
              __typename: "Channel",
              id: "223",
              name: "Channel",
            },
            isPublished: false,
            publishedAt: null,
          },
        ],
      } as unknown as Collection;
      // Act
      const result = getAvailabilityLabel(collection, intl, currentTheme);

      // Assert
      expect(result).toEqual({
        color: getStatusColor({ status: "error", currentTheme }).base,
        label: "{channelCount} {channelCount,plural, =1 {Channel} other {Channels}}",
      });
    });
  });
});
