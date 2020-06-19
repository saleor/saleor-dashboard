export enum Task {
  CUSTOM
}

export interface QueuedTask {
  id: number;
  handle: () => boolean;
  onCompleted: () => void;
  onError: (error: Error) => void;
}

export interface TaskData {
  handle?: () => boolean;
  onCompleted?: () => void;
  onError?: () => void;
}

export interface BackgroundTasksContextType {
  cancel: (id: number) => void;
  queue: (type: Task, data?: TaskData) => void;
}
