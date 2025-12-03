import BackgroundTasksContext from "@dashboard/containers/BackgroundTasks/context";
import { Task, TaskStatus } from "@dashboard/containers/BackgroundTasks/types";
import { renderHook } from "@testing-library/react-hooks";
import React from "react";

import useBackgroundTask from "./useBackgroundTask";

describe("useBackgroundTask", () => {
  it("should throw error when used outside of BackgroundTasksProvider", () => {
    // Arrange & Act & Assert
    const { result } = renderHook(() => useBackgroundTask());

    expect(result.error).toEqual(
      Error("useBackgroundTask must be used within BackgroundTasksProvider"),
    );
  });

  it("should return context when used within BackgroundTasksProvider", () => {
    // Arrange
    const mockQueue = jest.fn();
    const mockCancel = jest.fn();
    const mockContextValue = {
      queue: mockQueue,
      cancel: mockCancel,
    };
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <BackgroundTasksContext.Provider value={mockContextValue}>
        {children}
      </BackgroundTasksContext.Provider>
    );

    // Act
    const { result } = renderHook(() => useBackgroundTask(), { wrapper });

    // Assert
    expect(result.current).toEqual(mockContextValue);
    expect(result.current.queue).toBe(mockQueue);
    expect(result.current.cancel).toBe(mockCancel);
  });

  it("should allow calling queue method from the context", () => {
    // Arrange
    const mockQueue = jest.fn();
    const mockCancel = jest.fn();
    const mockContextValue = {
      queue: mockQueue,
      cancel: mockCancel,
    };
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <BackgroundTasksContext.Provider value={mockContextValue}>
        {children}
      </BackgroundTasksContext.Provider>
    );
    const { result } = renderHook(() => useBackgroundTask(), { wrapper });

    // Act
    result.current.queue(Task.CUSTOM, {
      handle: () => Promise.resolve(TaskStatus.SUCCESS),
      onCompleted: jest.fn(),
    });

    // Assert
    expect(mockQueue).toHaveBeenCalledTimes(1);
    expect(mockQueue).toHaveBeenCalledWith(Task.CUSTOM, {
      handle: expect.any(Function),
      onCompleted: expect.any(Function),
    });
  });
});
