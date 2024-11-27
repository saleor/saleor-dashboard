import { channelsList } from "@dashboard/channels/fixtures";
import { ChannelFragment } from "@dashboard/graphql";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import { HomeSidebar } from "./HomeSidebar";

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
  FormattedMessage: ({ defaultMessage }: { defaultMessage: string }) => <>{defaultMessage}</>,
}));

describe("HomeSidebar", () => {
  it("should allow to change channel and see analytics", async () => {
    // Arrange
    const channel = channelsList[0] as ChannelFragment;
    const setChannel = jest.fn();

    render(
      <HomeSidebar
        channel={channel}
        setChannel={setChannel}
        channels={channelsList}
        hasPermissionToManageOrders={true}
      />,
    );

    // Act

    await act(async () => {
      await userEvent.click(screen.getByRole("combobox"));
      await userEvent.click(screen.getAllByTestId("channel-option")[1]);
    });

    // Assert
    expect(setChannel).toHaveBeenCalledWith(channelsList[1].id);
  });
});
