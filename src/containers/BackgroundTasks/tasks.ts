import { IMessageContext } from "@saleor/components/messages";
import { commonMessages } from "@saleor/intl";
import { JobStatusEnum } from "@saleor/types/globalTypes";
import { ApolloQueryResult } from "apollo-client";
import { defineMessages, IntlShape } from "react-intl";

import {
  InvoiceGenerateParams,
  QueuedTask,
  TaskData,
  TaskStatus
} from "./types";
import { CheckExportFileStatus } from "./types/CheckExportFileStatus";
import { CheckOrderInvoicesStatus } from "./types/CheckOrderInvoicesStatus";

const messages = defineMessages({
  exportFinishedText: {
    defaultMessage:
      "Product export has finished and was sent to your email address."
  },
  exportFinishedTitle: {
    defaultMessage: "Exporting CSV finished",
    description: "csv file exporting has finished, header"
  },
  invoiceGenerateFinishedText: {
    defaultMessage:
      "Requested Invoice was generated. It was added to the top of the invoice list on this view. Enjoy!"
  },
  invoiceGenerateFinishedTitle: {
    defaultMessage: "Invoice Generated",
    description: "invoice generating has finished, header"
  },
  invoiceGenerationFailedTitle: {
    defaultMessage: "Invoice Generation",
    description: "dialog header, title"
  }
});

function getTaskStatus(jobStatus: JobStatusEnum): TaskStatus {
  switch (jobStatus) {
    case JobStatusEnum.SUCCESS:
      return TaskStatus.SUCCESS;
    case JobStatusEnum.PENDING:
      return TaskStatus.PENDING;
    default:
      return TaskStatus.FAILURE;
  }
}

export async function handleTask(task: QueuedTask): Promise<TaskStatus> {
  let status = TaskStatus.PENDING;
  try {
    status = await task.handle();
    if (status !== TaskStatus.PENDING) {
      task.onCompleted({
        status
      });
    }
  } catch (error) {
    task.onError(error);
  }

  return status;
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

export function queueInvoiceGenerate(
  id: number,
  generateInvoice: InvoiceGenerateParams,
  tasks: React.MutableRefObject<QueuedTask[]>,
  fetch: () => Promise<ApolloQueryResult<CheckOrderInvoicesStatus>>,
  notify: IMessageContext,
  intl: IntlShape
) {
  if (!generateInvoice) {
    throw new Error("generateInvoice is required when creating custom task");
  }
  tasks.current = [
    ...tasks.current,
    {
      handle: async () => {
        const result = await fetch();
        const status = result.data.order.invoices.find(
          invoice => invoice.id === generateInvoice.invoiceId
        ).status;

        return getTaskStatus(status);
      },
      id,
      onCompleted: data =>
        data.status === TaskStatus.SUCCESS
          ? notify({
              status: "success",
              text: intl.formatMessage(messages.invoiceGenerateFinishedText),
              title: intl.formatMessage(messages.invoiceGenerateFinishedTitle)
            })
          : notify({
              text: intl.formatMessage(commonMessages.somethingWentWrong),
              title: intl.formatMessage(messages.invoiceGenerationFailedTitle)
            }),
      onError: handleError,
      status: TaskStatus.PENDING
    }
  ];
}

export function queueExport(
  id: number,
  tasks: React.MutableRefObject<QueuedTask[]>,
  fetch: () => Promise<ApolloQueryResult<CheckExportFileStatus>>,
  notify: IMessageContext,
  intl: IntlShape
) {
  tasks.current = [
    ...tasks.current,
    {
      handle: async () => {
        const result = await fetch();
        const status = result.data.exportFile.status;

        return getTaskStatus(status);
      },
      id,
      onCompleted: () =>
        notify({
          text: intl.formatMessage(messages.exportFinishedText),
          title: intl.formatMessage(messages.exportFinishedTitle)
        }),
      onError: handleError,
      status: TaskStatus.PENDING
    }
  ];
}
