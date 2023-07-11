import { Collection } from "@dashboard/collections/types";
import { CollectionChannels } from "@dashboard/components/ChannelsAvailabilityDropdown/utils";
import { COLOR_WARNING } from "@dashboard/misc";
import { ThemeTokensValues } from "@saleor/macaw-ui/next";
import { IntlShape } from "react-intl";

import {
  getAvailablilityLabel,
  getAvailablilityLabelWhenSelectedChannel,
} from "./datagrid";

const theme = {
  colors: {
    background: {
      surfaceCriticalDepressed: "surfaceCriticalDepressed",
      surfaceBrandDepressed: "surfaceBrandDepressed",
      decorativeSurfaceSubdued2: "decorativeSurfaceSubdued2",
      surfaceBrandSubdued: "surfaceBrandSubdued",
    },
  },
} as ThemeTokensValues;

const currentTheme = "defaultLight";

const intl = {
  formatMessage: jest.fn(x => x.defaultMessage),
} as unknown as IntlShape;

describe("getAvailablilityLabelWhenSelectedChannel", () => {
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
      publicationDate: null,
    } as CollectionChannels;

    // Act;
    const result = getAvailablilityLabelWhenSelectedChannel(
      channel,
      intl,
      currentTheme,
      theme,
    );

    // Assert
    expect(result).toEqual({
      color: "decorativeSurfaceSubdued2",
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
      publicationDate: null,
    } as CollectionChannels;

    // Act;
    const result = getAvailablilityLabelWhenSelectedChannel(
      channel,
      intl,
      currentTheme,
      theme,
    );

    // Assert
    expect(result).toEqual({
      color: "surfaceCriticalDepressed",
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
      publicationDate: "2021-09-09T12:00:00+00:00",
    } as CollectionChannels;

    // Act;
    const result = getAvailablilityLabelWhenSelectedChannel(
      channel,
      intl,
      currentTheme,
      theme,
    );

    // Assert
    expect(result).toEqual({
      color: COLOR_WARNING,
      label: "Scheduled to publish",
    });
  });
});

describe("getAvailablilityLabel", () => {
  it("should return no channels label when there is not channels in collection", () => {
    // Arrange
    const collection = {
      channelListings: [],
    } as unknown as Collection;

    // Act
    const result = getAvailablilityLabel(collection, intl, currentTheme, theme);

    // Assert
    expect(result).toEqual({
      color: "surfaceCriticalDepressed",
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
          publicationDate: null,
        },
      ],
    } as unknown as Collection;

    // Act
    const result = getAvailablilityLabel(collection, intl, currentTheme, theme);

    // Assert
    expect(result).toEqual({
      color: "decorativeSurfaceSubdued2",
      label:
        "{channelCount} {channelCount,plural, =1 {Channel} other {Channels}}",
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
          publicationDate: null,
        },
      ],
    } as unknown as Collection;

    // Act
    const result = getAvailablilityLabel(collection, intl, currentTheme, theme);

    // Assert
    expect(result).toEqual({
      color: "surfaceCriticalDepressed",
      label:
        "{channelCount} {channelCount,plural, =1 {Channel} other {Channels}}",
    });
  });
});
