import { renderHook } from "@testing-library/react-hooks";

import {
  backgroundTasksRefreshTime,
  useBackgroundTasks
} from "./BackgroundTasksProvider";
import { Task, TaskData } from "./types";

jest.useFakeTimers();

describe("Background task provider", () => {
  it("can queue a task", () => {
    const onCompleted = jest.fn();
    const onError = jest.fn();

    const { result } = renderHook(useBackgroundTasks);

    const taskId = result.current.queue(Task.CUSTOM, {
      handle: () => true,
      onCompleted,
      onError
    });
    expect(taskId).toBe(1);
    expect(onCompleted).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();

    jest.runOnlyPendingTimers();

    expect(onCompleted).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it("can handle task error", () => {
    const onCompleted = jest.fn();
    const onError = jest.fn();

    const { result } = renderHook(useBackgroundTasks);

    result.current.queue(Task.CUSTOM, {
      handle: () => {
        throw new Error("dummy error");
      },
      onCompleted,
      onError
    });

    jest.runOnlyPendingTimers();

    expect(onCompleted).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalled();
  });

  it("can cancel task", () => {
    const onCompleted = jest.fn();

    const { result } = renderHook(useBackgroundTasks);

    const taskId = result.current.queue(Task.CUSTOM, {
      handle: () => true,
      onCompleted
    });

    jest.advanceTimersByTime(backgroundTasksRefreshTime - 1000);
    result.current.cancel(taskId);

    jest.runOnlyPendingTimers();

    expect(onCompleted).not.toHaveBeenCalled();
  });

  it("can queue multiple tasks", () => {
    const responses = [
      {
        finished: false
      },
      {
        finished: false
      }
    ];

    const tasks: TaskData[] = responses.map(response => ({
      handle: () => response.finished,
      onCompleted: jest.fn()
    }));

    const { result } = renderHook(useBackgroundTasks);

    tasks.forEach(task => result.current.queue(Task.CUSTOM, task));

    jest.runOnlyPendingTimers();

    expect(tasks[0].onCompleted).not.toHaveBeenCalled();
    expect(tasks[1].onCompleted).not.toHaveBeenCalled();

    responses[0].finished = true;

    jest.runOnlyPendingTimers();

    expect(tasks[0].onCompleted).toHaveBeenCalled();
    expect(tasks[1].onCompleted).not.toHaveBeenCalled();

    responses[1].finished = true;

    jest.runOnlyPendingTimers();

    expect(tasks[1].onCompleted).toHaveBeenCalled();
    expect(tasks[1].onCompleted).toHaveBeenCalled();
  });
});
