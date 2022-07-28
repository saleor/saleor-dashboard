import { ApolloClient, useApolloClient } from "@apollo/client";
import { IMessageContext } from "@saleor/components/messages";
import useNotifier from "@saleor/hooks/useNotifier";
import React from "react";
import { IntlShape, useIntl } from "react-intl";

import BackgroundTasksContext from "./context";
import { checkExportFileStatus, checkOrderInvoicesStatus } from "./queries";
import {
  handleTask,
  queueCustom,
  queueExport,
  queueInvoiceGenerate,
} from "./tasks";
import { QueuedTask, Task, TaskData, TaskStatus } from "./types";

export const backgroundTasksRefreshTime = 15 * 1000;

export function useBackgroundTasks(
  apolloClient: Pick<ApolloClient<any>, "query">,
  notify: IMessageContext,
  intl: IntlShape,
) {
  const idCounter = React.useRef(0);
  const tasks = React.useRef<QueuedTask[]>([]);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      const queue = async () => {
        try {
          await Promise.all(
            tasks.current.map(async task => {
              if (task.status === TaskStatus.PENDING) {
                let status: TaskStatus;

                try {
                  status = await handleTask(task);
                } catch (error) {
                  throw error;
                }
                if (status !== TaskStatus.PENDING) {
                  const taskIndex = tasks.current.findIndex(
                    t => t.id === task.id,
                  );
                  tasks.current[taskIndex].status = status;
                }
              }
            }),
          );
        } catch (error) {
          throw error;
        }
      };

      queue();
    }, backgroundTasksRefreshTime);

    return () => clearInterval(intervalId);
  });

  function cancel(id: number) {
    tasks.current = tasks.current.filter(task => task.id !== id);
  }

  function queue(type: Task, data?: TaskData) {
    idCounter.current += 1;
    switch (type) {
      case Task.CUSTOM:
        queueCustom(idCounter.current, tasks, data);
        break;
      case Task.INVOICE_GENERATE:
        queueInvoiceGenerate(
          idCounter.current,
          data.generateInvoice,
          tasks,
          () =>
            apolloClient.query({
              fetchPolicy: "network-only",
              query: checkOrderInvoicesStatus,
              variables: {
                id: data.generateInvoice.orderId,
              },
            }),
          notify,
          intl,
        );
        break;
      case Task.EXPORT:
        queueExport(
          idCounter.current,
          tasks,
          () =>
            apolloClient.query({
              fetchPolicy: "network-only",
              query: checkExportFileStatus,
              variables: {
                id: data.id,
              },
            }),
          notify,
          intl,
        );
        break;
    }

    return idCounter.current;
  }

  return {
    cancel,
    queue,
  };
}

const BackgroundTasksProvider: React.FC = ({ children }) => {
  const apolloClient = useApolloClient();
  const notify = useNotifier();
  const intl = useIntl();
  const { cancel, queue } = useBackgroundTasks(apolloClient, notify, intl);

  return (
    <BackgroundTasksContext.Provider
      value={{
        cancel,
        queue,
      }}
    >
      {children}
    </BackgroundTasksContext.Provider>
  );
};

BackgroundTasksProvider.displayName = "BackgroundTasksProvider";
export default BackgroundTasksProvider;
