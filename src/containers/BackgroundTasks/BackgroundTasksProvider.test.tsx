import { createMockClient } from "@apollo/client/testing";
import { JobStatusEnum } from "@saleor/graphql";
import { renderHook } from "@testing-library/react-hooks";

import {
  backgroundTasksRefreshTime,
  useBackgroundTasks,
} from "./BackgroundTasksProvider";
import { checkExportFileStatus } from "./queries";
import { Task, TaskData, TaskStatus } from "./types";

jest.useFakeTimers();

function renderBackgroundTasks() {
  const mockClient = createMockClient(
    [
      {
        request: {
          query: checkExportFileStatus,
        },
        result: {
          data: {
            exportFile: {
              __typename: "ExportFile",
              id: "123",
              status: JobStatusEnum.SUCCESS,
            },
          },
        },
      },
    ],
    checkExportFileStatus,
  );

  const intl = {
    formatMessage: ({ defaultMessage }) => defaultMessage,
  };

  return renderHook(() =>
    useBackgroundTasks(mockClient, jest.fn(), intl as any),
  );
}

describe("Background task provider", () => {
  it("can queue a task", done => {
    const handle = jest.fn<Promise<TaskStatus>, []>(
      () => new Promise(resolve => resolve(TaskStatus.SUCCESS)),
    );
    const onCompleted = jest.fn();
    const onError = jest.fn();

    const { result } = renderBackgroundTasks();

    const taskId = result.current.queue(Task.CUSTOM, {
      handle,
      onCompleted,
      onError,
    });
    expect(taskId).toBe(1);
    expect(handle).toHaveBeenCalledTimes(0);
    expect(onCompleted).toHaveBeenCalledTimes(0);
    expect(onError).toHaveBeenCalledTimes(0);

    jest.runOnlyPendingTimers();

    setImmediate(() => {
      expect(handle).toHaveBeenCalledTimes(1);
      expect(onCompleted).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledTimes(0);

      done();
    });
  });

  it("can handle task error", done => {
    const handle = jest.fn<Promise<TaskStatus>, []>(
      () =>
        new Promise(() => {
          throw new Error("dummy error");
        }),
    );
    const onCompleted = jest.fn();
    const onError = jest.fn();

    const { result } = renderBackgroundTasks();

    result.current.queue(Task.CUSTOM, {
      handle,
      onCompleted,
      onError,
    });

    jest.runOnlyPendingTimers();

    setImmediate(() => {
      expect(handle).toHaveBeenCalledTimes(1);
      expect(onCompleted).toHaveBeenCalledTimes(0);
      expect(onError).toHaveBeenCalledTimes(1);

      done();
    });
  });

  it("can cancel task", done => {
    const onCompleted = jest.fn();

    const { result } = renderBackgroundTasks();

    const taskId = result.current.queue(Task.CUSTOM, {
      handle: () => new Promise(resolve => resolve(TaskStatus.SUCCESS)),
      onCompleted,
    });

    // Cancel task before executing it
    jest.advanceTimersByTime(backgroundTasksRefreshTime * 0.9);
    result.current.cancel(taskId);

    jest.runOnlyPendingTimers();

    setImmediate(() => {
      expect(onCompleted).toHaveBeenCalledTimes(0);

      done();
    });
  });

  it("can queue multiple tasks", done => {
    let cycle = 0;

    // Completed in two cycles
    const shortTask = {
      handle: jest.fn(() =>
        Promise.resolve(cycle > 1 ? TaskStatus.SUCCESS : TaskStatus.PENDING),
      ),
      onCompleted: jest.fn(),
    };

    // Completed in three cycles
    const longTask = {
      handle: jest.fn(() =>
        Promise.resolve(cycle > 2 ? TaskStatus.SUCCESS : TaskStatus.PENDING),
      ),
      onCompleted: jest.fn(),
    };
    const tasks: TaskData[] = [shortTask, longTask];

    const { result } = renderBackgroundTasks();

    tasks.forEach(task => result.current.queue(Task.CUSTOM, task));

    // Set time to backgroundTasksRefreshTime
    cycle += 1;
    jest.advanceTimersByTime(backgroundTasksRefreshTime + 100);

    setImmediate(() => {
      expect(shortTask.handle).toHaveBeenCalledTimes(1);
      expect(longTask.handle).toHaveBeenCalledTimes(1);
      expect(shortTask.onCompleted).toHaveBeenCalledTimes(0);
      expect(longTask.onCompleted).toHaveBeenCalledTimes(0);

      // Set time to backgroundTasksRefreshTime * 2
      cycle += 1;
      jest.advanceTimersByTime(backgroundTasksRefreshTime);

      setImmediate(() => {
        expect(shortTask.handle).toHaveBeenCalledTimes(2);
        expect(longTask.handle).toHaveBeenCalledTimes(2);
        expect(shortTask.onCompleted).toHaveBeenCalledTimes(1);
        expect(longTask.onCompleted).toHaveBeenCalledTimes(0);

        // Set time to backgroundTasksRefreshTime * 3
        cycle += 1;
        jest.advanceTimersByTime(backgroundTasksRefreshTime);

        setImmediate(() => {
          expect(shortTask.handle).toHaveBeenCalledTimes(2);
          expect(longTask.handle).toHaveBeenCalledTimes(3);
          expect(shortTask.onCompleted).toHaveBeenCalledTimes(1);
          expect(longTask.onCompleted).toHaveBeenCalledTimes(1);

          done();
        });
      });
    });
  });
});
