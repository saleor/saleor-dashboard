import { EventDeliveryStatusEnum } from "@dashboard/graphql";

import { getLatestFailedAttemptFromWebhooks } from "./utils";

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
