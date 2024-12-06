// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import Form from "@dashboard/components/Form";
import Timeline, { TimelineAddNote, TimelineNote } from "@dashboard/components/Timeline";
import { GiftCardEventsEnum, useGiftCardAddNoteMutation } from "@dashboard/graphql";
import useNotifier from "@dashboard/hooks/useNotifier";
import { HistoryComponentLoader } from "@dashboard/orders/components/OrderHistory/HistoryComponentLoader";
import { FormattedMessage, useIntl } from "react-intl";

import { GIFT_CARD_DETAILS_QUERY } from "../queries";
import GiftCardTimelineEvent from "./GiftCardTimelineEvent";
import useGiftCardHistoryEvents from "./hooks/useGiftCardHistoryEvents";
import { giftCardHistoryMessages as messages } from "./messages";

interface FormData {
  message: string;
}

const GiftCardHistory = () => {
  const intl = useIntl();
  const notify = useNotifier();
  const { id, events } = useGiftCardHistoryEvents();
  const [addTimelineNote, { loading }] = useGiftCardAddNoteMutation({
    refetchQueries: [GIFT_CARD_DETAILS_QUERY],
    onCompleted: ({ giftCardAddNote }) => {
      const { errors } = giftCardAddNote;

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
  const onNoteAdd = (data: FormData) => {
    const { message } = data;

    addTimelineNote({ variables: { id, input: { message } } });
  };

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          <FormattedMessage {...messages.historyHeaderTitle} />
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        {events ? (
          <Timeline>
            <Form initial={{ message: "" }} onSubmit={onNoteAdd} resetOnSubmit>
              {({ change, data, reset, submit }) => (
                <TimelineAddNote
                  message={data.message}
                  reset={reset}
                  onChange={change}
                  onSubmit={submit}
                  disabled={loading}
                />
              )}
            </Form>
            {events
              .slice()
              .reverse()
              .map(event => {
                const { id, message, type, date, user, app } = event;

                if (type === GiftCardEventsEnum.NOTE_ADDED) {
                  return (
                    <TimelineNote
                      date={date}
                      user={user}
                      message={message}
                      key={id}
                      app={app}
                      hasPlainDate={false}
                    />
                  );
                }

                return <GiftCardTimelineEvent key={id} date={date} event={event} />;
              })}
          </Timeline>
        ) : (
          <HistoryComponentLoader />
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

export default GiftCardHistory;
