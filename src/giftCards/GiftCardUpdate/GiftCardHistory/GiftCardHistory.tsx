import { Typography } from "@material-ui/core";
import Form from "@saleor/components/Form";
import Hr from "@saleor/components/Hr";
import Skeleton from "@saleor/components/Skeleton";
import Timeline, {
  TimelineAddNote,
  TimelineNote,
} from "@saleor/components/Timeline";
import {
  GiftCardEventsEnum,
  useGiftCardAddNoteMutation,
} from "@saleor/graphql";
import useNotifier from "@saleor/hooks/useNotifier";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { GIFT_CARD_DETAILS_QUERY } from "../queries";
import GiftCardTimelineEvent from "./GiftCardTimelineEvent";
import useGiftCardHistoryEvents from "./hooks/useGiftCardHistoryEvents";
import { giftCardHistoryMessages as messages } from "./messages";
import useStyles from "./styles";

interface FormData {
  message: string;
}

const GiftCardHistory: React.FC = () => {
  const intl = useIntl();
  const notify = useNotifier();
  const { id, events } = useGiftCardHistoryEvents();
  const classes = useStyles();

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
    <div className={classes.root}>
      <Typography className={classes.header} color="textSecondary">
        <FormattedMessage {...messages.historyHeaderTitle} />
      </Typography>
      <Hr />
      <Timeline>
        {events ? (
          <>
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
                const { id, message, type, date, user } = event;

                if (type === GiftCardEventsEnum.NOTE_ADDED) {
                  return (
                    <TimelineNote
                      date={date}
                      user={user}
                      message={message}
                      key={id}
                    />
                  );
                }

                return (
                  <GiftCardTimelineEvent key={id} date={date} event={event} />
                );
              })}
          </>
        ) : (
          <Skeleton />
        )}
      </Timeline>
    </div>
  );
};

export default GiftCardHistory;
