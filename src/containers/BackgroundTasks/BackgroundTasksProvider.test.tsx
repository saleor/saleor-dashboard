import { renderHook } from "@testing-library/react-hooks";

import {
  backgroundTasksRefreshTime,
  useBackgroundTasks
} from "./BackgroundTasksProvider";
import { Task, TaskData } from "./types";

jest.useFakeTimers();

describe("Background task provider", () => {
  it("can queue a task", done => {
    const handle = jest.fn<Promise<boolean>, []>(
      () => new Promise(resolve => resolve(true))
    );
    const onCompleted = jest.fn();
    const onError = jest.fn();

    const { result } = renderHook(useBackgroundTasks);

    const taskId = result.current.queue(Task.CUSTOM, {
      handle,
      onCompleted,
      onError
    });
    expect(taskId).toBe(1);
    expect(handle).not.toHaveBeenCalled();
    expect(onCompleted).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();

    jest.runOnlyPendingTimers();

    setImmediate(() => {
      expect(handle).toHaveBeenCalled();
      expect(onCompleted).toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();

      done();
    });
  });

  it("can handle task error", done => {
    const handle = jest.fn<Promise<boolean>, []>(
      () =>
        new Promise(() => {
          throw new Error("dummy error");
        })
    );
    const onCompleted = jest.fn();
    const onError = jest.fn();

    const { result } = renderHook(useBackgroundTasks);

    result.current.queue(Task.CUSTOM, {
      handle,
      onCompleted,
      onError
    });

    jest.runOnlyPendingTimers();

    setImmediate(() => {
      expect(handle).toHaveBeenCalled();
      expect(onCompleted).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalled();

      done();
    });
  });

  it("can cancel task", done => {
    const onCompleted = jest.fn();

    const { result } = renderHook(useBackgroundTasks);

    const taskId = result.current.queue(Task.CUSTOM, {
      handle: () => new Promise(resolve => resolve(true)),
      onCompleted
    });

    // Cancel task before executing it
    jest.advanceTimersByTime(backgroundTasksRefreshTime * 0.9);
    result.current.cancel(taskId);

    jest.runOnlyPendingTimers();

    setImmediate(() => {
      expect(onCompleted).not.toHaveBeenCalled();

      done();
    });
  });

  it("can queue multiple tasks", done => {
    const responses: Array<Promise<boolean>> = [
      new Promise(resolve =>
        setTimeout(() => resolve(true), backgroundTasksRefreshTime * 1.4)
      ),
      new Promise(resolve =>
        setTimeout(() => resolve(true), backgroundTasksRefreshTime * 2.1)
      )
    ];

    const tasks: TaskData[] = responses.map(response => ({
      handle: () => response,
      onCompleted: jest.fn()
    }));

    const { result } = renderHook(useBackgroundTasks);

    tasks.forEach(task => result.current.queue(Task.CUSTOM, task));

    // Set time to backgroundTasksRefreshTime
    jest.advanceTimersByTime(backgroundTasksRefreshTime + 100);

    setImmediate(() => {
      expect(tasks[0].onCompleted).not.toHaveBeenCalled();
      expect(tasks[1].onCompleted).not.toHaveBeenCalled();

      // Set time to backgroundTasksRefreshTime * 2
      jest.advanceTimersByTime(backgroundTasksRefreshTime);

      setImmediate(() => {
        expect(tasks[0].onCompleted).toHaveBeenCalled();
        expect(tasks[1].onCompleted).not.toHaveBeenCalled();

        // Set time to backgroundTasksRefreshTime * 3
        jest.advanceTimersByTime(backgroundTasksRefreshTime);

        setImmediate(() => {
          expect(tasks[0].onCompleted).toHaveBeenCalled();
          expect(tasks[1].onCompleted).toHaveBeenCalled();

          done();
        });
      });
    });
  });
});
