// @ts-strict-ignore
import { FetchResult } from "@apollo/client";
import { DashboardCard } from "@dashboard/components/Card";
import Form from "@dashboard/components/Form";
import { Pill } from "@dashboard/components/Pill";
import {
  Timeline,
  TimelineAddNote,
  TimelineEvent,
  TimelineEventProps,
  TimelineNote,
} from "@dashboard/components/Timeline";
import { OrderEventFragment, OrderEventsEnum, OrderNoteUpdateMutation } from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import { ORDER_EVENTS_DOCS_URL } from "@dashboard/links";
import { Box, Text, vars } from "@saleor/macaw-ui-next";
import moment from "moment-timezone";
import { FormattedMessage, useIntl } from "react-intl";

import ExtendedTimelineEvent from "./ExtendedTimelineEvent";
import { HistoryComponentLoader } from "./HistoryComponentLoader";
import LinkedTimelineEvent from "./LinkedTimelineEvent";
import { getEventMessage } from "./messages";
import { OrderHistoryDate } from "./OrderHistoryDate";
import { getEventSecondaryTitle, isTimelineEventOfType } from "./utils";

// Helper to get date group key - smart grouping based on age
const getDateGroupKey = (date: string | null): DateGroupKey => {
  if (!date) {
    return "UNKNOWN";
  }

  const eventDate = moment(date);
  const now = moment();
  const today = moment().startOf("day");
  const yesterday = moment().subtract(1, "day").startOf("day");
  const daysAgo = now.diff(eventDate, "days");

  // Daily precision for last 48 hours
  if (eventDate.isSame(today, "day")) {
    return "TODAY";
  } else if (eventDate.isSame(yesterday, "day")) {
    return "YESTERDAY";
  }

  // Progressive broader buckets for older events
  if (daysAgo < 7) {
    return "LAST_7_DAYS";
  } else if (daysAgo < 30) {
    return "LAST_30_DAYS";
  } else {
    return "OLDER";
  }
};

// Group events by date - preserves insertion order
const groupEventsByDate = (events: OrderEventFragment[]): Array<[string, OrderEventFragment[]]> => {
  const groups: Array<[string, OrderEventFragment[]]> = [];
  const groupMap = new Map<string, number>();

  events.forEach(event => {
    const key = getDateGroupKey(event.date);

    if (!groupMap.has(key)) {
      groupMap.set(key, groups.length);
      groups.push([key, []]);
    }

    const index = groupMap.get(key)!;

    groups[index][1].push(event);
  });

  return groups;
};

// Date group labels - keys are used internally, labels are internationalized in component
type DateGroupKey = "TODAY" | "YESTERDAY" | "LAST_7_DAYS" | "LAST_30_DAYS" | "OLDER" | "UNKNOWN";

// Date group header component with internationalized labels
const DateGroupHeader = ({ groupKey }: { groupKey: string }) => {
  const intl = useIntl();

  const getLabel = (key: string): string => {
    switch (key) {
      case "TODAY":
        return intl.formatMessage({
          id: "zWgbGg",
          defaultMessage: "Today",
        });
      case "YESTERDAY":
        return intl.formatMessage({
          id: "IradBW",
          defaultMessage: "Yesterday",
          description: "date group header",
        });
      case "LAST_7_DAYS":
        return intl.formatMessage({
          id: "0/Y0nG",
          defaultMessage: "Last 7 days",
          description: "date group header",
        });
      case "LAST_30_DAYS":
        return intl.formatMessage({
          id: "4kcpaI",
          defaultMessage: "Last 30 days",
          description: "date group header",
        });
      case "OLDER":
        return intl.formatMessage({
          id: "LU8dtl",
          defaultMessage: "Older",
          description: "date group header",
        });
      default:
        return intl.formatMessage({
          id: "yn7Stx",
          defaultMessage: "Unknown",
          description: "date group header",
        });
    }
  };

  return (
    <Box paddingY={3}>
      <Text
        size={2}
        fontWeight="medium"
        color="default2"
        style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
      >
        {getLabel(groupKey)}
      </Text>
    </Box>
  );
};

export interface FormData {
  message: string;
}

interface OrderHistoryProps {
  history: OrderEventFragment[];
  orderCurrency: string;
  onNoteAdd: (data: FormData) => SubmitPromise;
  onNoteUpdate: (id: string, message: string) => Promise<FetchResult<OrderNoteUpdateMutation>>;
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
      <DashboardCard.Header flexDirection="column" alignItems="start">
        <DashboardCard.Title size={6} fontWeight="medium">
          <FormattedMessage id="XBfvKN" defaultMessage="Order History" />
        </DashboardCard.Title>
        <DashboardCard.Subtitle fontSize={3} color="default2">
          <FormattedMessage
            id="6oxTyq"
            defaultMessage="All events related to this order. For more information regarding order events visit our docs {link}."
            values={{
              link: (
                <Box
                  as="a"
                  target="_blank"
                  rel="noopener noreferer"
                  textDecoration="underline"
                  style={{
                    textUnderlineOffset: vars.spacing[1],
                  }}
                  href={ORDER_EVENTS_DOCS_URL}
                >
                  <FormattedMessage defaultMessage="here" id="hniz8Z" />
                </Box>
              ),
            }}
          />
        </DashboardCard.Subtitle>
      </DashboardCard.Header>

      <DashboardCard.Content>
        {history ? (
          <Timeline>
            <Form confirmLeave initial={{ message: "" }} onSubmit={onNoteAdd} resetOnSubmit>
              {({ change, data, reset, submit, triggerChange }) => (
                <TimelineAddNote
                  message={data.message}
                  reset={reset}
                  onChange={e => {
                    change(e);

                    // Reset dirty state if message is empty (back to initial state)
                    if (e.target.value === "") {
                      triggerChange(false);
                    }
                  }}
                  onSubmit={submit}
                  label={intl.formatMessage({
                    id: "LgbKvU",
                    defaultMessage: "Comment",
                  })}
                  buttonLabel={
                    <FormattedMessage
                      id="H5jL5+"
                      defaultMessage="Add Comment"
                      description="button"
                    />
                  }
                />
              )}
            </Form>
            {(() => {
              const reversedHistory = history.slice().reverse();
              const groupedEvents = groupEventsByDate(reversedHistory);

              const renderEvent = (
                event: OrderEventFragment,
                index: number,
                groupEvents: OrderEventFragment[],
              ) => {
                const { id, user, date, message, type, app, related } = event;
                const isLastInGroup = index === groupEvents.length - 1;

                if (isTimelineEventOfType("note", type)) {
                  return (
                    <TimelineNote
                      onNoteUpdate={onNoteUpdate}
                      onNoteUpdateLoading={onNoteUpdateLoading!}
                      id={id}
                      date={date}
                      dateNode={<OrderHistoryDate date={date} />}
                      user={user}
                      message={message}
                      key={id}
                      app={app}
                      eventData={event}
                      isLastInGroup={isLastInGroup}
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
                      dateNode={<OrderHistoryDate date={date} />}
                      user={user}
                      message={message}
                      key={id}
                      app={app}
                      eventData={event}
                      isLastInGroup={isLastInGroup}
                    />
                  );
                }

                if (
                  type === OrderEventsEnum.ORDER_MARKED_AS_PAID ||
                  type === OrderEventsEnum.ORDER_FULLY_PAID
                ) {
                  const hasSecondaryInfo =
                    isTimelineEventOfType("secondaryTitle", type) && event.transactionReference;

                  return (
                    <TimelineEvent
                      date={date}
                      dateNode={<OrderHistoryDate date={date} />}
                      eventData={event}
                      user={user}
                      eventType={type}
                      isLastInGroup={isLastInGroup}
                      title={
                        <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
                          <FormattedMessage id="KpP/aW" defaultMessage="Order was marked as" />
                          <Pill
                            color="success"
                            size="small"
                            label={intl.formatMessage({
                              id: "u/vOPu",
                              defaultMessage: "Paid",
                            })}
                            style={{ paddingLeft: 4, paddingRight: 4 }}
                          />
                        </Box>
                      }
                      key={id}
                    >
                      {hasSecondaryInfo && (
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Text size={2} color="default2">
                            <FormattedMessage id="jGvclB" defaultMessage="Transaction Reference" />
                          </Text>
                          <Text size={2}>{event.transactionReference}</Text>
                        </Box>
                      )}
                    </TimelineEvent>
                  );
                }

                if (isTimelineEventOfType("extendable", type)) {
                  return (
                    <ExtendedTimelineEvent
                      key={event.id}
                      event={event}
                      orderCurrency={orderCurrency}
                      hasPlainDate={false}
                      dateNode={<OrderHistoryDate date={date} />}
                      isLastInGroup={isLastInGroup}
                    />
                  );
                }

                if (isTimelineEventOfType("linked", type)) {
                  return (
                    <LinkedTimelineEvent
                      event={event}
                      key={id}
                      hasPlainDate={false}
                      dateNode={<OrderHistoryDate date={date} />}
                      isLastInGroup={isLastInGroup}
                    />
                  );
                }

                return (
                  <TimelineEvent
                    {...getTimelineEventTitleProps(event)}
                    hasPlainDate={false}
                    key={id}
                    date={date}
                    dateNode={<OrderHistoryDate date={date} />}
                    eventData={event}
                    user={user}
                    eventType={type}
                    isLastInGroup={isLastInGroup}
                  />
                );
              };

              return groupedEvents.map(([dateKey, events]) => (
                <Box key={dateKey}>
                  <DateGroupHeader groupKey={dateKey} />
                  {events.map((event, index) => renderEvent(event, index, events))}
                </Box>
              ));
            })()}
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
