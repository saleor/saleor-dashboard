import { useUser } from "@dashboard/auth";
import { useUserAccountUpdateMutation } from "@dashboard/graphql";
import { renderHook } from "@testing-library/react-hooks";

import {
  DELIVERY_ATTEMPT_KEY,
  useSidebarWebhookAlertMetadata,
} from "./useSidebarWebhookAlertMetadata";

jest.mock("@dashboard/auth", () => ({
  useUser: jest.fn().mockReturnValue({ user: null }),
}));

jest.mock("@dashboard/graphql", () => ({
  useUserAccountUpdateMutation: jest.fn(),
}));

describe("useSidebarWebhookAlertMetadata", () => {
  const mockSaveMetadata = jest.fn();
  const mockMetadataInput = {
    lastClickDate: "2023-01-01",
    lastFailedAttemptDate: "2023-01-02",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useUserAccountUpdateMutation as jest.Mock).mockReturnValue([mockSaveMetadata]);
  });

  it("should persist metadata correctly", async () => {
    // Arrange & Act
    const { result } = renderHook(() => useSidebarWebhookAlertMetadata());

    await result.current.persist(mockMetadataInput);

    // Assert
    expect(mockSaveMetadata).toHaveBeenCalledWith({
      variables: {
        input: {
          metadata: [
            {
              key: DELIVERY_ATTEMPT_KEY,
              value: JSON.stringify(mockMetadataInput),
            },
          ],
        },
      },
    });
  });

  it("should return parsed metadata when it exists", () => {
    // Arrange
    (useUser as jest.Mock).mockReturnValue({
      user: {
        metadata: [
          {
            key: DELIVERY_ATTEMPT_KEY,
            value: JSON.stringify(mockMetadataInput),
          },
        ],
      },
    });

    // Act
    const { result } = renderHook(() => useSidebarWebhookAlertMetadata());

    // Assert
    expect(result.current.sidebarDotRemoteState).toEqual(mockMetadataInput);
  });

  it("should return null when metadata doesn't exist", () => {
    // Arrange
    (useUser as jest.Mock).mockReturnValue({
      user: {
        metadata: [],
      },
    });

    // Act
    const { result } = renderHook(() => useSidebarWebhookAlertMetadata());

    // Assert
    expect(result.current.sidebarDotRemoteState).toBeNull();
  });

  it("should return null when metadata is invalid JSON", () => {
    // Arrange
    (useUser as jest.Mock).mockReturnValue({
      user: {
        metadata: [
          {
            key: DELIVERY_ATTEMPT_KEY,
            value: "invalid-json",
          },
        ],
      },
    });

    // Act
    const { result } = renderHook(() => useSidebarWebhookAlertMetadata());

    // Assert
    expect(result.current.sidebarDotRemoteState).toBeNull();
  });
});
