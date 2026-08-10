import Wrapper from "@test/wrapper";
import { fireEvent, render, screen } from "@testing-library/react";

import { CollectionChannelVisibilitySection } from "./CollectionChannelVisibilitySection";

describe("CollectionChannelVisibilitySection", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-01-15T12:00:00Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("restores the saved publishedAt when toggling back on", () => {
    // Arrange
    const onChange = jest.fn();
    const savedPublishedAt = "2024-06-01T10:00:00Z";

    render(
      <Wrapper>
        <CollectionChannelVisibilitySection
          channelId="channel-1"
          isPublished={false}
          publishedAt={null}
          savedChannelListing={{
            isPublished: true,
            publishedAt: savedPublishedAt,
          }}
          onChange={onChange}
        />
      </Wrapper>,
    );

    // Act
    fireEvent.click(screen.getByRole("button", { pressed: false }));

    // Assert
    expect(onChange).toHaveBeenCalledWith(true, savedPublishedAt);
  });

  it("calls onChange(false, null) when toggling off", () => {
    // Arrange
    const onChange = jest.fn();

    render(
      <Wrapper>
        <CollectionChannelVisibilitySection
          channelId="channel-1"
          isPublished={true}
          publishedAt={null}
          savedChannelListing={{
            isPublished: true,
            publishedAt: null,
          }}
          onChange={onChange}
        />
      </Wrapper>,
    );

    // Act
    fireEvent.click(screen.getByRole("button", { pressed: true }));

    // Assert
    expect(onChange).toHaveBeenCalledWith(false, null);
  });
});
