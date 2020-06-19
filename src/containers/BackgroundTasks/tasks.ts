import { QueuedTask, TaskData } from "./types";

export function handleTask(task: QueuedTask) {
  let ok: boolean;
  try {
    ok = task.handle();
  } catch (error) {
    task.onError(error);
  }

  if (ok) {
    task.onCompleted();
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
      onError: data.onError || handleError
    }
  ];
}
