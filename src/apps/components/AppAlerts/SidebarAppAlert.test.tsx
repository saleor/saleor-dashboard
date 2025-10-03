import {
  useAppFailedPendingWebhooksLazyQuery,
  useUserAccountUpdateMutation,
} from "@dashboard/graphql";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";

import { SidebarAppAlert } from "./SidebarAppAlert";
import { useAppsAlert } from "./useAppsAlert";

jest.mock("@dashboard/hooks/useHasManagedAppsPermission");
jest.mock("react-router-dom");
jest.mock("@dashboard/graphql");

jest.mock("react-router-dom", () => ({
  Link: jest.fn(({ to, ...props }) => <a href={to} {...props} />),
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
    const { result } = renderHook(() => useAppsAlert());

    await waitFor(() => {
      expect(result.current.hasNewFailedAttempts).toBe(true);
    });

    render(<SidebarAppAlert hasNewFailedAttempts={result.current.hasNewFailedAttempts} />);

    const trigger = screen.getByTestId("sidebar-app-alert-trigger");

    fireEvent.focus(trigger);

    await screen.findByRole(/tooltip/);

    // Assert
    // Radix tooltip content mounts twice - https://github.com/radix-ui/primitives/issues/3034
    expect(
      screen.queryAllByText("Issues found.{break}Review extension alerts.")[0],
    ).toBeInTheDocument();
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
    const { result } = renderHook(() => useAppsAlert());

    await waitFor(() => {
      expect(result.current.hasNewFailedAttempts).toBe(false);
    });

    render(<SidebarAppAlert hasNewFailedAttempts={result.current.hasNewFailedAttempts} />);

    // Assert
    expect(screen.queryByTestId("sidebar-app-alert-trigger")).not.toBeInTheDocument();
  });
});
