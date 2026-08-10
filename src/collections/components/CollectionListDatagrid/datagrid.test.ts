import { type Collection } from "@dashboard/collections/types";
import { type CollectionChannels } from "@dashboard/components/ChannelsAvailabilityDropdown/utils";
import { type IntlShape } from "react-intl";

import { getAvailabilityLabel, getAvailabilityLabelWhenSelectedChannel } from "./datagrid";

const intl = {
  formatMessage: jest.fn(x => x.defaultMessage),
} as unknown as IntlShape;

describe("CollectionListDatagrid datagrid utils", () => {
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

      // Act
      const result = getAvailabilityLabelWhenSelectedChannel(channel, intl);

      // Assert
      expect(result).toEqual({
        status: "success",
        label: "Published",
      });
    });

    it("should return unpublished label with quiet warning status", () => {
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

      // Act
      const result = getAvailabilityLabelWhenSelectedChannel(channel, intl);

      // Assert
      expect(result).toEqual({
        status: "warning",
        label: "Unpublished",
      });
    });

    it("should return Scheduled to publish label when channel has a future date", () => {
      // Arrange
      const channel = {
        __typename: "CollectionChannelListing",
        channel: {
          __typename: "Channel",
          id: "223",
          name: "Channel",
        },
        isPublished: true,
        publishedAt: "2099-09-09T12:00:00+00:00",
      } as CollectionChannels;

      // Act
      const result = getAvailabilityLabelWhenSelectedChannel(channel, intl);

      // Assert
      expect(result).toEqual({
        status: "scheduled",
        label: "Scheduled to publish",
      });
    });
  });

  describe("getAvailabilityLabel", () => {
    it("should return no channels label with quiet warning status", () => {
      // Arrange
      const collection = {
        channelListings: [],
      } as unknown as Collection;

      // Act
      const result = getAvailabilityLabel(collection, intl);

      // Assert
      expect(result).toEqual({
        status: "warning",
        label: "No channels",
      });
    });

    it("should return success when some channels are published", () => {
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
      const result = getAvailabilityLabel(collection, intl);

      // Assert
      expect(result).toEqual({
        status: "success",
        label: "{channelCount} {channelCount,plural, =1 {Channel} other {Channels}}",
      });
    });

    it("should return scheduled when a channel has a future publication date", () => {
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
            publishedAt: "2099-09-09T12:00:00+00:00",
          },
        ],
      } as unknown as Collection;

      // Act
      const result = getAvailabilityLabel(collection, intl);

      // Assert
      expect(result).toEqual({
        status: "scheduled",
        label: "{channelCount} {channelCount,plural, =1 {Channel} other {Channels}}",
      });
    });

    it("should return warning when channels exist but none are published", () => {
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
      const result = getAvailabilityLabel(collection, intl);

      // Assert
      expect(result).toEqual({
        status: "warning",
        label: "{channelCount} {channelCount,plural, =1 {Channel} other {Channels}}",
      });
    });
  });
});
