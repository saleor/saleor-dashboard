import { useAppHasProblemsLazyQuery } from "@dashboard/graphql";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import { useIntervalActionWithState } from "@dashboard/hooks/useIntervalActionWithState";
import { renderHook } from "@testing-library/react-hooks";
import moment from "moment-timezone";

import { useAppsAlert } from "./useAppsAlert";
import { useAppsFailedDeliveries } from "./useAppsFailedDeliveries";
import { useSidebarDotState } from "./useSidebarDotState";

jest.mock("@dashboard/graphql");
jest.mock("@dashboard/hooks/useHasManagedAppsPermission");
jest.mock("@dashboard/hooks/useIntervalActionWithState");
jest.mock("./useAppsFailedDeliveries");
jest.mock("./useSidebarDotState");

const mockFetchAppsWebhooks = jest.fn();
const mockFetchHasAppsAnyProblems = jest.fn();
const mockHandleFailedAttempt = jest.fn();
const mockHandleAppsListItemClick = jest.fn();

const setupMocks = ({
  hasProblems = false,
  lastFailedWebhookDate = null as moment.Moment | null,
  hasManagedAppsPermission = true,
  appProblemsData = null as Record<string, unknown> | null,
} = {}) => {
  (useHasManagedAppsPermission as jest.Mock).mockReturnValue({
    hasManagedAppsPermission,
  });

  (useSidebarDotState as jest.Mock).mockReturnValue({
    hasProblems,
    handleFailedAttempt: mockHandleFailedAttempt,
    handleAppsListItemClick: mockHandleAppsListItemClick,
  });

  (useAppsFailedDeliveries as jest.Mock).mockReturnValue({
    lastFailedWebhookDate,
    fetchAppsWebhooks: mockFetchAppsWebhooks,
  });

  (useAppHasProblemsLazyQuery as jest.Mock).mockReturnValue([
    mockFetchHasAppsAnyProblems,
    { data: appProblemsData },
  ]);

  (useIntervalActionWithState as jest.Mock).mockReturnValue(undefined);
};

describe("useAppsAlert", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch webhooks and app problems on mount", () => {
    // Arrange
    setupMocks();

    // Act
    renderHook(() => useAppsAlert());

    // Assert
    expect(mockFetchAppsWebhooks).toHaveBeenCalled();
    expect(mockFetchHasAppsAnyProblems).toHaveBeenCalledWith({
      variables: { first: 100 },
    });
  });

  it("should return hasProblems: false when no failed attempts and no app problems", () => {
    // Arrange
    setupMocks({
      appProblemsData: {
        apps: {
          edges: [{ node: { id: "1", problems: [] } }],
        },
      },
    });

    // Act
    const { result } = renderHook(() => useAppsAlert());

    // Assert
    expect(result.current.hasProblems).toBe(false);
  });

  it("should return hasProblems: true when hasProblems is true", () => {
    // Arrange
    setupMocks({ hasProblems: true });

    // Act
    const { result } = renderHook(() => useAppsAlert());

    // Assert
    expect(result.current.hasProblems).toBe(true);
  });

  it("should return hasProblems: true when apps have problems", () => {
    // Arrange
    setupMocks({
      appProblemsData: {
        apps: {
          edges: [{ node: { id: "1", problems: [{ __typename: "AppProblem" }] } }],
        },
      },
    });

    // Act
    const { result } = renderHook(() => useAppsAlert());

    // Assert
    expect(result.current.hasProblems).toBe(true);
  });

  it("should return hasProblems: true when both failed attempts and app problems exist", () => {
    // Arrange
    setupMocks({
      hasProblems: true,
      appProblemsData: {
        apps: {
          edges: [{ node: { id: "1", problems: [{ __typename: "AppProblem" }] } }],
        },
      },
    });

    // Act
    const { result } = renderHook(() => useAppsAlert());

    // Assert
    expect(result.current.hasProblems).toBe(true);
  });

  it("should return hasProblems: false when apps data is null", () => {
    // Arrange
    setupMocks({ appProblemsData: null });

    // Act
    const { result } = renderHook(() => useAppsAlert());

    // Assert
    expect(result.current.hasProblems).toBe(false);
  });

  it("should return hasProblems: false when apps have empty problems array", () => {
    // Arrange
    setupMocks({
      appProblemsData: {
        apps: {
          edges: [{ node: { id: "1", problems: [] } }, { node: { id: "2", problems: [] } }],
        },
      },
    });

    // Act
    const { result } = renderHook(() => useAppsAlert());

    // Assert
    expect(result.current.hasProblems).toBe(false);
  });

  it("should return hasProblems: false when apps have null problems", () => {
    // Arrange
    setupMocks({
      appProblemsData: {
        apps: {
          edges: [{ node: { id: "1", problems: null } }],
        },
      },
    });

    // Act
    const { result } = renderHook(() => useAppsAlert());

    // Assert
    expect(result.current.hasProblems).toBe(false);
  });

  it("should call handleFailedAttempt when lastFailedWebhookDate is a moment instance", () => {
    // Arrange
    const date = moment("2024-01-15T10:00:00.000Z");

    setupMocks({ lastFailedWebhookDate: date });

    // Act
    renderHook(() => useAppsAlert());

    // Assert
    expect(mockHandleFailedAttempt).toHaveBeenCalledWith(date.toISOString());
  });

  it("should not call handleFailedAttempt when lastFailedWebhookDate is null", () => {
    // Arrange
    setupMocks({ lastFailedWebhookDate: null });

    // Act
    renderHook(() => useAppsAlert());

    // Assert
    expect(mockHandleFailedAttempt).not.toHaveBeenCalled();
  });

  it("should set up interval action with correct params when user has permission", () => {
    // Arrange
    setupMocks({ hasManagedAppsPermission: true });

    // Act
    renderHook(() => useAppsAlert());

    // Assert
    expect(useIntervalActionWithState).toHaveBeenCalledWith({
      action: mockFetchAppsWebhooks,
      interval: 5 * 60 * 1000,
      key: "webhook_deliveries_last_fetched",
      skip: false,
    });
  });

  it("should skip interval action when user has no permission", () => {
    // Arrange
    setupMocks({ hasManagedAppsPermission: false });

    // Act
    renderHook(() => useAppsAlert());

    // Assert
    expect(useIntervalActionWithState).toHaveBeenCalledWith(
      expect.objectContaining({ skip: true }),
    );
  });

  it("should return handleAppsListItemClick from sidebar dot state", () => {
    // Arrange
    setupMocks();

    // Act
    const { result } = renderHook(() => useAppsAlert());

    // Assert
    expect(result.current.handleAppsListItemClick).toBe(mockHandleAppsListItemClick);
  });

  it("should detect problems when only some apps have issues", () => {
    // Arrange
    setupMocks({
      appProblemsData: {
        apps: {
          edges: [
            { node: { id: "1", problems: [] } },
            { node: { id: "2", problems: [{ __typename: "AppProblem" }] } },
            { node: { id: "3", problems: [] } },
          ],
        },
      },
    });

    // Act
    const { result } = renderHook(() => useAppsAlert());

    // Assert
    expect(result.current.hasProblems).toBe(true);
  });
});
