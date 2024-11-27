import { useUser } from "@dashboard/auth";
import { useUpdateUserMetadataMutation } from "@dashboard/graphql";
import { OnboardingStepsIDs } from "@dashboard/newHome/homeOnboarding/onboardingContext/types";
import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";

import { useOnboardingStorage } from "./useOnboardingStorage";

jest.mock("@dashboard/auth", () => ({
  __esModule: true,
  useUser: jest.fn(),
}));

jest.mock("@dashboard/graphql");

jest.useFakeTimers();

jest.mock("lodash/debounce", () => jest.fn(fn => fn));

describe("useOnboardingStorage", () => {
  describe("getOnboardingState", () => {
    it("should return undefined when there is no onboarding in user metadata", () => {
      // Arrange
      (useUser as jest.Mock).mockImplementation(() => ({
        user: { metadata: [{ key1: "value1" }, { key2: "value2" }] },
      }));
      (useUpdateUserMetadataMutation as jest.Mock).mockReturnValue([jest.fn(), {}]);

      const { getOnboardingState } = renderHook(() => useOnboardingStorage()).result.current;

      // Act
      const result = getOnboardingState();

      // Assert
      expect(result).toBeUndefined();
    });

    it("should return onboarding state from user metadata", () => {
      // Arrange
      (useUser as jest.Mock).mockImplementation(() => ({
        user: {
          metadata: [
            {
              key: "onboarding",
              value: JSON.stringify({ steps: [], onboardingExpanded: true }),
            },
          ],
        },
      }));
      (useUpdateUserMetadataMutation as jest.Mock).mockReturnValue([jest.fn(), {}]);

      const { getOnboardingState } = renderHook(() => useOnboardingStorage()).result.current;

      // Act
      const result = getOnboardingState();

      // Assert
      expect(result).toEqual({ steps: [], onboardingExpanded: true });
    });
  });

  describe("saveOnboardingState", () => {
    it("should not save onboarding state when there is no user", async () => {
      // Arrange
      (useUser as jest.Mock).mockImplementation(() => ({ user: null }));

      const updateMetadataMock = jest.fn();

      (useUpdateUserMetadataMutation as jest.Mock).mockReturnValue([updateMetadataMock, {}]);

      const { result } = renderHook(() => useOnboardingStorage());

      // Act
      const returnValue = await act(async () => {
        return await result.current.saveOnboardingState({
          stepsCompleted: [],
          stepsExpanded: {} as Record<OnboardingStepsIDs, boolean>,
          onboardingExpanded: true,
        });
      });

      // Assert
      expect(returnValue).toBeUndefined();
      expect(updateMetadataMock).not.toHaveBeenCalled();
    });

    it("should save onboarding state to user metadata and be called only once", async () => {
      // Arrange
      (useUser as jest.Mock).mockImplementation(() => ({ user: { id: "1", metadata: [] } }));

      const updateMetadataMock = jest.fn();

      (useUpdateUserMetadataMutation as jest.Mock).mockReturnValue([updateMetadataMock, {}]);

      const { result } = renderHook(() => useOnboardingStorage());

      // Act
      await act(async () => {
        await result.current.saveOnboardingState({
          stepsCompleted: [],
          stepsExpanded: {} as Record<OnboardingStepsIDs, boolean>,
          onboardingExpanded: true,
        });
      });

      jest.runAllTimers();

      // Assert
      expect(updateMetadataMock).toHaveBeenCalledTimes(1);
      expect(updateMetadataMock).toHaveBeenCalledWith({
        variables: {
          id: "1",
          input: [
            {
              key: "onboarding",
              value: JSON.stringify({
                stepsCompleted: [],
                stepsExpanded: {} as Record<OnboardingStepsIDs, boolean>,
                onboardingExpanded: true,
              }),
            },
          ],
        },
      });
    });
  });
});
