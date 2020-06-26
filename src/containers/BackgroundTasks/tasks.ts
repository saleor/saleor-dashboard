import { IMessageContext } from "@saleor/components/messages";
import { CheckOrderInvoicesStatus } from "@saleor/orders/types/CheckOrderInvoicesStatus";
import { JobStatusEnum } from "@saleor/types/globalTypes";
import { ApolloQueryResult } from "apollo-client";
import { defineMessages, IntlShape } from "react-intl";

import {
  InvoiceGenerateParams,
  QueuedTask,
  TaskData,
  TaskStatus
} from "./types";

export const messages = defineMessages({
  invoiceGenerateFinishedText: {
    defaultMessage:
      "Requested Invoice was generated. It was added to the top of the invoice list on this view. Enjoy!"
  },
  invoiceGenerateFinishedTitle: {
    defaultMessage: "Invoice Generated",
    description: "invoice generating has finished, header"
  }
});

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

export function queueInvoiceGenerate(
  id: number,
  params: InvoiceGenerateParams,
  tasks: React.MutableRefObject<QueuedTask[]>,
  fetch: () => Promise<ApolloQueryResult<CheckOrderInvoicesStatus>>,
  notify: IMessageContext,
  intl: IntlShape
) {
  tasks.current = [
    ...tasks.current,
    {
      handle: async () => {
        const result = await fetch();
        return (
          result.data.order.invoices.find(
            invoice => invoice.id === params.invoiceId
          ).status === JobStatusEnum.SUCCESS
        );
      },
      id,
      onCompleted: () =>
        notify({
          text: intl.formatMessage(messages.invoiceGenerateFinishedText),
          title: intl.formatMessage(messages.invoiceGenerateFinishedTitle)
        }),
      onError: handleError,
      status: TaskStatus.PENDING
    }
  ];
}
