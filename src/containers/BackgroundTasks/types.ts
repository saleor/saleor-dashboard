export enum Task {
  CUSTOM
}
export enum TaskStatus {
  FAILURE,
  PENDING,
  SUCCESS
}

export interface OnCompletedTaskData {
  status: TaskStatus;
}
export type OnCompletedTaskFn = (data: OnCompletedTaskData) => void;

export interface QueuedTask {
  id: number;
  handle: () => Promise<TaskStatus>;
  status: TaskStatus;
  onCompleted: OnCompletedTaskFn;
  onError: (error: Error) => void;
}

export interface TaskData {
  id?: string;
  handle?: () => Promise<TaskStatus>;
  onCompleted?: OnCompletedTaskFn;
  onError?: () => void;
}

export interface BackgroundTasksContextType {
  cancel: (id: number) => void;
  queue: (type: Task, data?: TaskData) => void;
}
