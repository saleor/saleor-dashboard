// @ts-strict-ignore
import { FetchResult } from "@apollo/client";
import { DashboardCard } from "@dashboard/components/Card";
import { CopyableText } from "@dashboard/components/CopyableText/CopyableText";
import Form from "@dashboard/components/Form";
import { Pill } from "@dashboard/components/Pill";
import { Timeline, TimelineAddNote } from "@dashboard/components/Timeline/Timeline";
import { TimelineEvent } from "@dashboard/components/Timeline/TimelineEvent";
import { TimelineNote } from "@dashboard/components/Timeline/TimelineNote";
import { toActor } from "@dashboard/components/Timeline/utils";
import { OrderEventFragment, OrderEventsEnum, OrderNoteUpdateMutation } from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import { ORDER_EVENTS_DOCS_URL } from "@dashboard/links";
import { rippleRefreshedOrderSections } from "@dashboard/orders/ripples/newOrderSummary";
import { orderUrl } from "@dashboard/orders/urls";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { Box, Text, vars } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { ExtendedTimelineEvent } from "./ExtendedTimelineEvent";
import { HistoryComponentLoader } from "./HistoryComponentLoader";
import { getEventMessage } from "./messages";
import { OrderHistoryDate } from "./OrderHistoryDate";
import { groupEventsByDate, isTimelineEventOfType } from "./utils";

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

  return (
    <DashboardCard>
      <DashboardCard.Header flexDirection="column" alignItems="start">
        <DashboardCard.Title size={6} fontWeight="medium">
          <Box display="flex" alignItems="center" justifyContent="center" gap={4}>
            <FormattedMessage id="XBfvKN" defaultMessage="Order History" />
            <Ripple model={rippleRefreshedOrderSections} />
          </Box>
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
                  rel="noopener noreferrer"
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
                      date={<OrderHistoryDate date={date} />}
                      actor={toActor(user, app)}
                      message={message}
                      key={id}
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
                      date={<OrderHistoryDate date={date} />}
                      actor={toActor(user, app)}
                      message={message}
                      key={id}
                      eventData={event}
                      isLastInGroup={isLastInGroup}
                    />
                  );
                }

                if (
                  type === OrderEventsEnum.ORDER_MARKED_AS_PAID ||
                  type === OrderEventsEnum.ORDER_FULLY_PAID
                ) {
                  const hasTransactionRef = !!event.transactionReference;
                  const hasContent = hasTransactionRef || message;

                  return (
                    <TimelineEvent
                      date={<OrderHistoryDate date={date} />}
                      eventData={event}
                      actor={toActor(user, app)}
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
                      {hasContent && (
                        <Box display="flex" flexDirection="column" gap={1}>
                          {message && (
                            <Text size={2} style={{ whiteSpace: "pre-wrap" }}>
                              {message}
                            </Text>
                          )}
                          {hasTransactionRef && (
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Text size={2} color="default2">
                                <FormattedMessage
                                  id="jGvclB"
                                  defaultMessage="Transaction Reference"
                                />
                              </Text>
                              <CopyableText text={event.transactionReference} />
                            </Box>
                          )}
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
                      date={<OrderHistoryDate date={date} />}
                      isLastInGroup={isLastInGroup}
                    />
                  );
                }

                const hasRelatedOrder = !!event.relatedOrder;
                const hasLines = event.lines && event.lines.length > 0;
                const isFoldable = message || hasRelatedOrder || hasLines;

                if (isFoldable) {
                  return (
                    <TimelineEvent
                      title={getEventMessage(event, intl)}
                      hasPlainDate={false}
                      key={id}
                      date={<OrderHistoryDate date={date} />}
                      eventData={event}
                      actor={toActor(user, app)}
                      eventType={type}
                      isLastInGroup={isLastInGroup}
                    >
                      <Box display="flex" flexDirection="column" gap={1}>
                        {message && (
                          <Text size={2} style={{ whiteSpace: "pre-wrap" }}>
                            {message}
                          </Text>
                        )}
                        {hasLines &&
                          event.lines.map((line, i) => (
                            <Box
                              key={`${id}-line-${line.orderLine?.id || `${line.itemName}-${line.quantity}-${i}`}`}
                              display="flex"
                              alignItems="center"
                              justifyContent="space-between"
                              gap={3}
                            >
                              <Box display="flex" flexDirection="column">
                                <Text size={3} fontWeight="medium">
                                  {line.orderLine?.productName || line.itemName}
                                </Text>
                                {line.orderLine?.variantName && (
                                  <Text size={2} color="default2">
                                    {line.orderLine.variantName}
                                  </Text>
                                )}
                              </Box>
                              <Text size={3} color="default2" whiteSpace="nowrap" flexShrink="0">
                                ×{line.quantity}
                              </Text>
                            </Box>
                          ))}
                        {hasRelatedOrder && (
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Text size={2} color="default2">
                              <FormattedMessage id="pSqXo6" defaultMessage="Related Order" />
                            </Text>
                            <Link to={orderUrl(event.relatedOrder.id)}>
                              <Text size={2} textDecoration="underline">
                                #{event.relatedOrder.number}
                              </Text>
                            </Link>
                          </Box>
                        )}
                      </Box>
                    </TimelineEvent>
                  );
                }

                return (
                  <TimelineEvent
                    title={getEventMessage(event, intl)}
                    hasPlainDate={false}
                    key={id}
                    date={<OrderHistoryDate date={date} />}
                    eventData={event}
                    actor={toActor(user, app)}
                    eventType={type}
                    isLastInGroup={isLastInGroup}
                  />
                );
              };

              return groupedEvents.map(([dateKey, events]) => (
                <Box key={dateKey}>
                  {groupedEvents.length > 1 && <DateGroupHeader groupKey={dateKey} />}
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
