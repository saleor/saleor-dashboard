import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { channelsList } from "@dashboard/channels/fixtures";
import { ChannelFragment, PermissionEnum } from "@dashboard/graphql";
import { activities } from "@dashboard/home/fixtures";
import { ApolloMockedProvider } from "@test/ApolloMockedProvider";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import { HomeSidebar } from "./HomeSidebar";

jest.mock("@dashboard/auth/hooks/useUserPermissions");

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
  FormattedMessage: ({ defaultMessage }: { defaultMessage: string }) => <>{defaultMessage}</>,
}));

jest.mock("@dashboard/hooks/useNotifier", () => ({
  __esModule: true,
  default: jest.fn(() => () => undefined),
}));

jest.mock("./components/HomeActivities/useHomeActivities", () => ({
  useHomeActivities: jest.fn(() => ({
    activities,
    loading: false,
  })),
}));

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ApolloMockedProvider>{children}</ApolloMockedProvider>
);

afterEach(() => {
  jest.clearAllMocks();
});

describe("HomeSidebar", () => {
  it("should render chanel select, analytics and activities when user has permission to manage orders ", async () => {
    // Arrange
    (useUserPermissions as jest.Mock).mockReturnValue([{ code: PermissionEnum.MANAGE_ORDERS }]);

    const channel = channelsList[0] as ChannelFragment;
    const setChannel = jest.fn();

    render(
      <HomeSidebar
        channel={channel}
        setChannel={setChannel}
        channels={channelsList}
        hasPermissionToManageOrders={true}
      />,
      {
        wrapper: Wrapper,
      },
    );

    // Assert
    expect(screen.getByTestId("app-channel-select")).toBeInTheDocument();
    expect(screen.getByTestId("sales-analytics")).toBeInTheDocument();
    expect(screen.getByTestId("out-of-stock-analytics")).toBeInTheDocument();
    expect(screen.getByTestId("activity-card")).toBeInTheDocument();
  });

  it("should render only channel select when user has no permission to manage orders ", async () => {
    // Arrange
    (useUserPermissions as jest.Mock).mockReturnValue([]);

    const channel = channelsList[0] as ChannelFragment;
    const setChannel = jest.fn();

    render(
      <HomeSidebar
        channel={channel}
        setChannel={setChannel}
        channels={channelsList}
        hasPermissionToManageOrders={false}
      />,
      {
        wrapper: Wrapper,
      },
    );

    // Assert
    expect(screen.getByTestId("app-channel-select")).toBeInTheDocument();
    expect(screen.queryByTestId("sales-analytics")).not.toBeInTheDocument();
    expect(screen.queryByTestId("out-of-stock-analytics")).not.toBeInTheDocument();
    expect(screen.queryByTestId("activity-card")).not.toBeInTheDocument();
  });

  it("should allow to change channel", async () => {
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
      {
        wrapper: Wrapper,
      },
    );

    // Act

    await act(async () => {
      await userEvent.click(screen.getByRole("combobox"));
    });

    await act(async () => {
      await userEvent.click(screen.getAllByTestId("select-option")[1]);
    });

    // Assert
    expect(setChannel).toHaveBeenCalledWith(channelsList[1].id);
  });
});
