import { InstalledApp } from "@dashboard/apps/types";
import { EventDeliveryStatusEnum } from "@dashboard/graphql";

import { getLatestFailedAttemptFromWebhooks, sortInstalledAppsByIssues } from "./utils";

describe("getLatestFailedAttemptFromWebhook", () => {
  it("should return the latest failed attempt from failedDelivers", () => {
    // Arrange
    const webhook: any = {
      failedDelivers: {
        edges: [
          {
            node: {
              createdAt: "2023-10-01T10:00:00Z",
            },
          },
        ],
      },
      pendingDelivers: {
        edges: [
          {
            node: {
              attempts: {
                edges: [
                  {
                    node: {
                      status: EventDeliveryStatusEnum.FAILED,
                      createdAt: "2023-09-01T10:00:00Z",
                    },
                  },
                ],
              },
              id: "idnode",
            },
          },
        ],
      },
    };

    // Act
    const result = getLatestFailedAttemptFromWebhooks([webhook]);

    // Assert
    expect(result?.createdAt).toBe("2023-10-01T10:00:00Z");
  });

  it("should return the latest failed attempt from pendingDelivers", () => {
    // Arrange
    const webhook: any = {
      failedDelivers: {
        edges: [
          {
            node: {
              createdAt: "2023-09-01T10:00:00Z",
            },
          },
        ],
      },
      pendingDelivers: {
        edges: [
          {
            node: {
              attempts: {
                edges: [
                  {
                    node: {
                      status: EventDeliveryStatusEnum.FAILED,
                      createdAt: "2023-10-01T10:00:00Z",
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    };

    // Act
    const result = getLatestFailedAttemptFromWebhooks([webhook]);

    // Assert
    expect(result?.createdAt).toBe("2023-10-01T10:00:00Z");
  });

  it("should return null if there are no failed attempts", () => {
    // Arrange
    const webhook: any = {
      failedDelivers: {
        edges: [],
      },
      pendingDelivers: {
        edges: [],
      },
    };

    // Act
    const result = getLatestFailedAttemptFromWebhooks([webhook]);

    // Assert
    expect(result).toBeNull();
  });

  it("should return the latest failed attempt when both failedDelivers and pendingDelivers are present", () => {
    // Arrange
    const webhook: any = {
      failedDelivers: {
        edges: [
          {
            node: {
              createdAt: "2023-10-01T10:00:00Z",
              id: "old",
            },
          },
        ],
      },
      pendingDelivers: {
        edges: [
          {
            node: {
              attempts: {
                edges: [
                  {
                    node: {
                      status: EventDeliveryStatusEnum.FAILED,
                      createdAt: "2023-10-02T10:00:00Z",
                      id: "new",
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    };

    // Act
    const result = getLatestFailedAttemptFromWebhooks([webhook]);

    // Assert
    expect(result?.id).toBe("new");
  });
});

describe("sortInstalledAppsByIssues", () => {
  const createInstalledApp = (webhooks: any[]): InstalledApp =>
    ({
      app: {
        webhooks,
      },
    }) as InstalledApp;

  it("should sort properly if first app has issues and second app does not", () => {
    // Arrange
    const app1 = createInstalledApp([{ failedDelivers: { edges: [{}] } }]);
    const app2 = createInstalledApp([]);

    // Act
    const result = [app1, app2].sort(sortInstalledAppsByIssues);

    // Assert
    expect(result[0]).toBe(app1);
  });

  it("should sort properly if first app does not have issues and second app does", () => {
    // Arrange
    const app1 = createInstalledApp([]);
    const app2 = createInstalledApp([{ failedDelivers: { edges: [{}] } }]);

    // Act
    const result = [app1, app2].sort(sortInstalledAppsByIssues);

    // Assert
    expect(result[0]).toBe(app2);
  });

  it("should return 0 if both apps have issues", () => {
    // Arrange
    const app1 = createInstalledApp([{ failedDelivers: { edges: [{}] } }]);
    const app2 = createInstalledApp([{ failedDelivers: { edges: [{}] } }]);

    // Act
    const result = sortInstalledAppsByIssues(app1, app2);

    // Assert
    expect(result).toBe(0);
  });

  it("should return 0 if neither app has issues", () => {
    // Arrange
    const app1 = createInstalledApp([]);
    const app2 = createInstalledApp([]);

    // Act
    const result = sortInstalledAppsByIssues(app1, app2);

    // Assert
    expect(result).toBe(0);
  });
});
