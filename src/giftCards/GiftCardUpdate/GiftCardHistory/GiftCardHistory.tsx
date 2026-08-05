import Form from "@dashboard/components/Form";
import { groupEventsByDate } from "@dashboard/components/Timeline/groupEventsByDate";
import { Timeline, TimelineAddNote } from "@dashboard/components/Timeline/Timeline";
import { TimelineDateGroupHeader } from "@dashboard/components/Timeline/TimelineDateGroupHeader";
import { TimelineNote } from "@dashboard/components/Timeline/TimelineNote";
import { toActor } from "@dashboard/components/Timeline/utils";
import { useGiftCardDetails } from "@dashboard/giftCards/GiftCardUpdate/providers/GiftCardDetailsProvider";
import { GiftCardEventsEnum, useGiftCardAddNoteMutation } from "@dashboard/graphql";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { HistoryComponentLoader } from "@dashboard/orders/components/OrderHistory/HistoryComponentLoader";
import { Box, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { GIFT_CARD_DETAILS_QUERY } from "../queries";
import { GiftCardTimelineEvent } from "./GiftCardTimelineEvent";
import { giftCardHistoryMessages as messages } from "./messages";

interface FormData {
  message: string;
}

/**
 * Open (non-carded) activity section — sits last in DetailPageContent.
 * Timeline chrome is self-spacing; avoid wrapping in DetailSettingsCard / DetailGroupBox.
 */
export const GiftCardHistory = (): JSX.Element => {
  const intl = useIntl();
  const notify = useNotifier();
  const { giftCard } = useGiftCardDetails();
  const [addTimelineNote, { loading }] = useGiftCardAddNoteMutation({
    refetchQueries: [GIFT_CARD_DETAILS_QUERY],
    onCompleted: ({ giftCardAddNote }) => {
      const errors = giftCardAddNote?.errors ?? [];

      if (errors.length > 0) {
        notify({
          status: "error",
          text: intl.formatMessage(messages.noteAddError),
        });
      } else {
        notify({
          status: "success",
          text: intl.formatMessage(messages.noteAddedSuccessfully),
        });
      }
    },
  });
  const onNoteAdd = (data: FormData): void => {
    const { message } = data;

    if (!giftCard) {
      return;
    }

    addTimelineNote({ variables: { id: giftCard.id, input: { message } } });
  };

  const events = giftCard?.events ? giftCard.events.slice().reverse() : null;
  const groupedEvents = events ? groupEventsByDate(events) : null;
  const isSoleGroup = groupedEvents?.length === 1;

  return (
    <Box data-test-id="gift-card-timeline" display="flex" flexDirection="column" gap={4}>
      <Text size={5} fontWeight="bold" as="h2">
        <FormattedMessage {...messages.historyHeaderTitle} />
      </Text>
      {groupedEvents ? (
        <Timeline>
          <Form initial={{ message: "" }} onSubmit={onNoteAdd} resetOnSubmit>
            {({ change, data, reset, submit }) => (
              <TimelineAddNote
                message={data.message}
                reset={reset}
                onChange={change}
                onSubmit={submit}
                disabled={loading}
                showTimelineConnector={groupedEvents.length > 0}
              />
            )}
          </Form>
          {groupedEvents.map(([dateKey, groupEvents]) => (
            <Box key={dateKey}>
              <TimelineDateGroupHeader groupKey={dateKey} isSoleGroup={!!isSoleGroup} />
              {groupEvents.map((event, index) => {
                const { id, message, type, date, user, app } = event;
                const isLastInGroup = index === groupEvents.length - 1;

                if (type === GiftCardEventsEnum.NOTE_ADDED) {
                  return (
                    <TimelineNote
                      date={date}
                      actor={toActor(user, app)}
                      message={message}
                      key={id}
                      hasPlainDate={false}
                      isLastInGroup={isLastInGroup}
                    />
                  );
                }

                return (
                  <GiftCardTimelineEvent
                    key={id}
                    date={date}
                    event={event}
                    isLastInGroup={isLastInGroup}
                  />
                );
              })}
            </Box>
          ))}
        </Timeline>
      ) : (
        <HistoryComponentLoader />
      )}
    </Box>
  );
};
