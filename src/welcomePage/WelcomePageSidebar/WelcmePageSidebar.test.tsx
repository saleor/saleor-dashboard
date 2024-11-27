import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { channelsList } from "@dashboard/channels/fixtures";
import { ChannelFragment, PermissionEnum } from "@dashboard/graphql";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import { activities } from "../fixtures";
import { WelcomePageSidebar } from "./WelcomePageSidebar";

jest.mock("@dashboard/auth/hooks/useUserPermissions");
jest.mock("./components/WelcomePageActivities/useWelcomePageActivities", () => ({
  useWelcomePageActivities: jest.fn(() => ({ activities, loading: false })),
}));
jest.mock("./components/WelcomePageSalesAnalytics/useWelcomePageSalesAnalytics", () => ({
  useWelcomePageSalesAnalytics: jest.fn(() => ({
    analytics: {
      sales: {
        amount: 1000,
        currency: "USD",
      },
    },
    loading: false,
  })),
}));
jest.mock("./components/WelcomePageStocksAnalytics/useWelcomePageStocksAnalytics", () => ({
  useWelcomePageStocksAnalytics: jest.fn(() => ({
    analytics: {
      productsOutOfStock: 10,
    },
    loading: false,
  })),
}));

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

afterEach(() => {
  jest.clearAllMocks();
});

describe("WelcomePageSidebar", () => {
  it("should render chanel select, analytics and activities when user has permission to manage orders ", async () => {
    // Arrange
    (useUserPermissions as jest.Mock).mockReturnValue([{ code: PermissionEnum.MANAGE_ORDERS }]);

    const channel = channelsList[0] as ChannelFragment;
    const setChannel = jest.fn();

    render(
      <WelcomePageSidebar
        channel={channel}
        setChannel={setChannel}
        channels={channelsList}
        hasPermissionToManageOrders={true}
      />,
    );

    // Assert
    expect(screen.getByTestId("app-channel-select")).toBeInTheDocument();

    // Check sales analytics
    expect(screen.getByTestId("sales-analytics")).toHaveTextContent("1,000.00");
    expect(screen.getByTestId("sales-analytics")).toHaveTextContent("USD");

    // Check out-of-stock analytics
    expect(screen.getByTestId("out-of-stock-analytics")).toHaveTextContent("10");

    // Check activities
    expect(screen.getByTestId("activity-card")).toBeInTheDocument();
    expect(
      screen.getByText("Order #{orderId} was placed from draft by {userEmail}"),
    ).toBeInTheDocument();
    expect(screen.getByText("Order #{orderId} was fully paid")).toBeInTheDocument();
  });

  it("should render only channel select when user has no permission to manage orders ", async () => {
    // Arrange
    (useUserPermissions as jest.Mock).mockReturnValue([]);

    const channel = channelsList[0] as ChannelFragment;
    const setChannel = jest.fn();

    render(
      <WelcomePageSidebar
        channel={channel}
        setChannel={setChannel}
        channels={channelsList}
        hasPermissionToManageOrders={false}
      />,
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
      <WelcomePageSidebar
        channel={channel}
        setChannel={setChannel}
        channels={channelsList}
        hasPermissionToManageOrders={true}
      />,
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
    expect(screen.getByRole("combobox")).toHaveTextContent(channelsList[1].name);
  });
});
