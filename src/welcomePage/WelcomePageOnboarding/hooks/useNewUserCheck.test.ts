import { useUser } from "@dashboard/auth";
import { renderHook } from "@testing-library/react-hooks";

import { useNewUserCheck } from "./useNewUserCheck";

jest.mock("@dashboard/auth");

describe("useNewUserCheck", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules(); // Clear the module cache to ensure no env conflicts.
    process.env = { ...originalEnv }; // Reset the process.env before each test.
  });

  afterAll(() => {
    process.env = originalEnv; // Restore original process.env.
  });

  it("should return isNewUser as false if user is not defined", () => {
    // Arrange
    (useUser as jest.Mock).mockReturnValue({ user: null });

    process.env.ONBOARDING_USER_JOINED_DATE_THRESHOLD = "2023-01-01";

    // Act
    const { result } = renderHook(() => useNewUserCheck());

    // Assert
    expect(result.current).toEqual({ isNewUser: false, isUserLoading: true });
  });

  it("should return isNewUser as false if ONBOARDING_USER_JOINED_DATE_THRESHOLD is not set", () => {
    // Arrange
    (useUser as jest.Mock).mockReturnValue({ user: { dateJoined: "2023-02-01" } });

    delete process.env.ONBOARDING_USER_JOINED_DATE_THRESHOLD;

    // Act
    const { result } = renderHook(() => useNewUserCheck());

    // Assert
    expect(result.current).toEqual({ isNewUser: false, isUserLoading: false });
  });

  it("should return isNewUser as true if user joined after the threshold date", () => {
    // Arrange
    (useUser as jest.Mock).mockReturnValue({ user: { dateJoined: "2023-02-01" } });

    process.env.ONBOARDING_USER_JOINED_DATE_THRESHOLD = "2023-01-01";

    // Act
    const { result } = renderHook(() => useNewUserCheck());

    // Assert
    expect(result.current).toEqual({ isNewUser: true, isUserLoading: false });
  });

  it("should return isNewUser as false if user joined before the threshold date", () => {
    // Arrange
    (useUser as jest.Mock).mockReturnValue({ user: { dateJoined: "2022-12-31" } });

    process.env.ONBOARDING_USER_JOINED_DATE_THRESHOLD = "2023-01-01";

    // Act
    const { result } = renderHook(() => useNewUserCheck());

    // Assert
    expect(result.current).toEqual({ isNewUser: false, isUserLoading: false });
  });

  it("should return isNewUser as false if threshold date is invalid", () => {
    // Arrange
    (useUser as jest.Mock).mockReturnValue({ user: { dateJoined: "2023-01-01" } });

    process.env.ONBOARDING_USER_JOINED_DATE_THRESHOLD = "123456789";

    // Act
    const { result } = renderHook(() => useNewUserCheck());

    // Assert
    expect(result.current).toEqual({ isNewUser: false, isUserLoading: false });
  });

  it("should return isNewUser as false and isUserLoading true when uer is loading", () => {
    // Arrange
    (useUser as jest.Mock).mockReturnValue({ user: null, isUserLoading: true });

    // Act
    const { result } = renderHook(() => useNewUserCheck());

    // Assert
    expect(result.current).toEqual({ isNewUser: false, isUserLoading: true });
  });
});
