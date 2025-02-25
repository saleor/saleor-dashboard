import {
  useAppFailedPendingWebhooksLazyQuery,
  useUserAccountUpdateMutation,
} from "@dashboard/graphql";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import { act, fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";

import { SidebarAppAlert } from "./SidebarAppAlert";

jest.mock("@dashboard/hooks/useHasManagedAppsPermission");
jest.mock("react-router-dom");
jest.mock("@dashboard/graphql");

jest.mock("react-router-dom", () => ({
  Link: jest.fn(({ to, ...props }) => <a href={to} {...props} />),
}));

jest.mock("react-intl", () => ({
  FormattedMessage: jest.fn(({ defaultMessage }) => defaultMessage),
  defineMessages: jest.fn(),
}));

describe("SidebarAppAlert", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useUserAccountUpdateMutation as jest.Mock).mockReturnValue([jest.fn()]);
  });

  it("displays sidebar alert dot when there are webhook failures, TC_ID: D_INT_01", async () => {
    // Arrange
    (useHasManagedAppsPermission as jest.Mock).mockReturnValue({
      hasManagedAppsPermission: true,
    });
    (useAppFailedPendingWebhooksLazyQuery as jest.Mock).mockReturnValue([
      jest.fn(),
      {
        data: {
          apps: {
            edges: [
              {
                node: {
                  webhooks: [
                    {
                      failedDelivers: { edges: [] },
                      pendingDelivers: {
                        edges: [
                          {
                            node: {
                              attempts: {
                                edges: [
                                  {
                                    node: {
                                      status: "FAILED",
                                      createdAt: "2023-01-19T09:50:43.343Z",
                                    },
                                  },
                                ],
                              },
                            },
                          },
                        ],
                      },
                    },
                    {
                      failedDelivers: { edges: [] },
                      pendingDelivers: null,
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    ]);

    // Act
    await act(async () => {
      render(<SidebarAppAlert />);
    });

    const trigger = screen.getByTestId("sidebar-app-alert-trigger");

    fireEvent.focus(trigger);

    await screen.findByRole(/tooltip/);

    // Assert
    // Radix tooltip content mounts twice - https://github.com/radix-ui/primitives/issues/3034
    expect(screen.queryAllByText("Issues found.{break}Review app alerts.")[0]).toBeInTheDocument();
  });

  it("doesn't display sidebar alert dot when there are no webhook failures", async () => {
    // Arrange
    (useHasManagedAppsPermission as jest.Mock).mockReturnValue({
      hasManagedAppsPermission: true,
    });
    (useAppFailedPendingWebhooksLazyQuery as jest.Mock).mockReturnValue([
      jest.fn(),
      {
        data: {
          apps: {
            edges: [
              {
                node: {
                  webhooks: [
                    {
                      failedDelivers: { edges: [] },
                      pendingDelivers: {
                        edges: [],
                      },
                    },
                    {
                      failedDelivers: { edges: [] },
                      pendingDelivers: null,
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    ]);

    // Act
    await act(async () => {
      render(<SidebarAppAlert />);
    });

    // Assert
    expect(screen.queryByTestId("sidebar-app-alert-trigger")).not.toBeInTheDocument();
  });
});
