// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import Form from "@dashboard/components/Form";
import {
  Timeline,
  TimelineAddNote,
  TimelineEvent,
  TimelineEventProps,
  TimelineNote,
} from "@dashboard/components/Timeline";
import { OrderEventFragment } from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ExtendedTimelineEvent from "./ExtendedTimelineEvent";
import { HistoryComponentLoader } from "./HistoryComponentLoader";
import LinkedTimelineEvent from "./LinkedTimelineEvent";
import { getEventMessage } from "./messages";
import { getEventSecondaryTitle, isTimelineEventOfType } from "./utils";

export interface FormData {
  message: string;
}

interface OrderHistoryProps {
  history: OrderEventFragment[];
  orderCurrency: string;
  onNoteAdd: (data: FormData) => SubmitPromise;
  onNoteUpdate: (id: string, message: string) => Promise<void>;
  onNoteUpdateLoading: boolean;
}

const OrderHistory = ({
  history,
  orderCurrency,
  onNoteAdd,
  onNoteUpdate,
  onNoteUpdateLoading,
}: OrderHistoryProps) => {
  const intl = useIntl();
  const getTimelineEventTitleProps = (event: OrderEventFragment): Partial<TimelineEventProps> => {
    const { type, message } = event;
    const title = isTimelineEventOfType("rawMessage", type)
      ? message
      : getEventMessage(event, intl);

    if (isTimelineEventOfType("secondaryTitle", type)) {
      return {
        secondaryTitle: intl.formatMessage(...getEventSecondaryTitle(event)),
        title,
      };
    }

    return { title };
  };

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          <FormattedMessage id="XBfvKN" defaultMessage="Order History" />
        </DashboardCard.Title>
      </DashboardCard.Header>

      <DashboardCard.Content>
        {history ? (
          <Timeline>
            <Form confirmLeave initial={{ message: "" }} onSubmit={onNoteAdd} resetOnSubmit>
              {({ change, data, reset, submit }) => (
                <TimelineAddNote
                  message={data.message}
                  reset={reset}
                  onChange={change}
                  onSubmit={submit}
                />
              )}
            </Form>
            {history
              .slice()
              .reverse()
              .map(event => {
                const { id, user, date, message, type, app, related } = event;

                if (isTimelineEventOfType("note", type)) {
                  return (
                    <TimelineNote
                      onNoteUpdate={onNoteUpdate}
                      onNoteUpdateLoading={onNoteUpdateLoading!}
                      id={id}
                      date={date}
                      user={user}
                      message={message}
                      key={id}
                      app={app}
                    />
                  );
                }

                if (isTimelineEventOfType("note_updated", type)) {
                  return (
                    <TimelineNote
                      onNoteUpdate={onNoteUpdate}
                      onNoteUpdateLoading={onNoteUpdateLoading!}
                      relatedId={related.id}
                      id={id}
                      date={date}
                      user={user}
                      message={message}
                      key={id}
                      app={app}
                    />
                  );
                }

                if (isTimelineEventOfType("extendable", type)) {
                  return (
                    <ExtendedTimelineEvent
                      key={event.id}
                      event={event}
                      orderCurrency={orderCurrency}
                      hasPlainDate={false}
                    />
                  );
                }

                if (isTimelineEventOfType("linked", type)) {
                  return <LinkedTimelineEvent event={event} key={id} hasPlainDate={false} />;
                }

                return (
                  <TimelineEvent
                    {...getTimelineEventTitleProps(event)}
                    hasPlainDate={false}
                    key={id}
                    date={date}
                  />
                );
              })}
          </Timeline>
        ) : (
          <HistoryComponentLoader />
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

OrderHistory.displayName = "OrderHistory";
export default OrderHistory;
