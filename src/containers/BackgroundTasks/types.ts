export enum Task {
  CUSTOM,
  INVOICE_GENERATE
}
export enum TaskStatus {
  PENDING,
  ENDED
}
export interface InvoiceGenerateParams {
  orderId: string;
  invoiceId: string;
}

export interface QueuedTask {
  id: number;
  handle: () => Promise<boolean>;
  status: TaskStatus;
  onCompleted: () => void;
  onError: (error: Error) => void;
}

export type TaskParams = InvoiceGenerateParams;

export interface TaskData {
  params?: TaskParams;
  handle?: () => Promise<boolean>;
  onCompleted?: () => void;
  onError?: () => void;
}

export interface BackgroundTasksContextType {
  cancel: (id: number) => void;
  queue: (type: Task, data?: TaskData) => void;
}
