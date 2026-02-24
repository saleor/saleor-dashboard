import {
  criticalProblemFixture,
  dismissedProblemFixture,
  warningProblemFixture,
  webhookErrorFixture,
} from "@dashboard/extensions/fixtures";
import { type AppProblem } from "@dashboard/extensions/types";
import { act, renderHook } from "@testing-library/react-hooks";

import { useExtensionProblems } from "./useExtensionProblems";

describe("InstalledExtensions / components / useExtensionProblems", () => {
  it("filters out dismissed problems from activeProblems", () => {
    // Arrange
    const problems: AppProblem[] = [
      criticalProblemFixture,
      warningProblemFixture,
      dismissedProblemFixture,
    ];

    // Act
    const { result } = renderHook(() => useExtensionProblems(problems));

    // Assert
    expect(result.current.activeProblems).toHaveLength(2);
    expect(result.current.activeProblems).toEqual(
      expect.arrayContaining([criticalProblemFixture, warningProblemFixture]),
    );
  });

  it("counts total active (non-dismissed) problems", () => {
    // Arrange
    const problems: AppProblem[] = [
      criticalProblemFixture,
      warningProblemFixture,
      dismissedProblemFixture,
      webhookErrorFixture,
    ];

    // Act
    const { result } = renderHook(() => useExtensionProblems(problems));

    // Assert
    expect(result.current.totalCount).toBe(3);
  });

  it("counts critical problems among active problems", () => {
    // Arrange
    const problems: AppProblem[] = [
      criticalProblemFixture,
      warningProblemFixture,
      dismissedProblemFixture,
      webhookErrorFixture,
    ];

    // Act
    const { result } = renderHook(() => useExtensionProblems(problems));

    // Assert
    expect(result.current.criticalCount).toBe(1);
  });

  it("sets hasActiveProblems to true when there are active problems", () => {
    // Arrange & Act
    const { result } = renderHook(() => useExtensionProblems([criticalProblemFixture]));

    // Assert
    expect(result.current.hasActiveProblems).toBe(true);
  });

  it("sets hasActiveProblems to false when all problems are dismissed", () => {
    // Arrange & Act
    const { result } = renderHook(() => useExtensionProblems([dismissedProblemFixture]));

    // Assert
    expect(result.current.hasActiveProblems).toBe(false);
  });

  it("sets hasAnyProblems based on total problems count including dismissed", () => {
    // Arrange & Act
    const { result } = renderHook(() => useExtensionProblems([dismissedProblemFixture]));

    // Assert
    expect(result.current.hasAnyProblems).toBe(true);
  });

  it("returns all zeros for empty problems array", () => {
    // Arrange & Act
    const { result } = renderHook(() => useExtensionProblems([]));

    // Assert
    expect(result.current.totalCount).toBe(0);
    expect(result.current.criticalCount).toBe(0);
    expect(result.current.hasActiveProblems).toBe(false);
    expect(result.current.hasAnyProblems).toBe(false);
    expect(result.current.activeProblems).toEqual([]);
  });

  it("toggles problemsVisible state", () => {
    // Arrange
    const { result } = renderHook(() => useExtensionProblems([criticalProblemFixture]));
    const initialVisible = result.current.problemsVisible;

    // Act
    act(() => {
      result.current.toggleProblems();
    });

    // Assert
    expect(result.current.problemsVisible).toBe(!initialVisible);
  });

  it("initializes modalOpen as false", () => {
    // Arrange & Act
    const { result } = renderHook(() => useExtensionProblems([criticalProblemFixture]));

    // Assert
    expect(result.current.modalOpen).toBe(false);
  });

  it("allows setting modalOpen state", () => {
    // Arrange
    const { result } = renderHook(() => useExtensionProblems([criticalProblemFixture]));

    // Act
    act(() => {
      result.current.setModalOpen(true);
    });

    // Assert
    expect(result.current.modalOpen).toBe(true);
  });
});
