import { QueuedTask, TaskData, TaskStatus } from "./types";

export async function handleTask(task: QueuedTask): Promise<boolean> {
  let ok = false;
  try {
    ok = await task.handle();
    if (ok) {
      task.onCompleted();
    }
  } catch (error) {
    task.onError(error);
  }

  return ok;
}

export function handleError(error: Error) {
  throw error;
}

export function queueCustom(
  id: number,
  tasks: React.MutableRefObject<QueuedTask[]>,
  data: TaskData
) {
  (["handle", "onCompleted"] as Array<keyof TaskData>)
    .filter(field => !data[field])
    .forEach(field => {
      throw new Error(`${field} is required when creating custom task`);
    });

  tasks.current = [
    ...tasks.current,
    {
      handle: data.handle,
      id,
      onCompleted: data.onCompleted,
      onError: data.onError || handleError,
      status: TaskStatus.PENDING
    }
  ];
}
