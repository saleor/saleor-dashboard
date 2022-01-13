import { Typography } from "@material-ui/core";
import { appPath } from "@saleor/apps/urls";
import Form from "@saleor/components/Form";
import Hr from "@saleor/components/Hr";
import Link from "@saleor/components/Link";
import Skeleton from "@saleor/components/Skeleton";
import Timeline, {
  TimelineAddNote,
  TimelineEvent,
  TimelineNote
} from "@saleor/components/Timeline";
import { customerPath } from "@saleor/customers/urls";
import useNotifier from "@saleor/hooks/useNotifier";
import { orderPath } from "@saleor/orders/urls";
import { staffMemberDetailsPath } from "@saleor/staff/urls";
import { GiftCardEventsEnum } from "@saleor/types/globalTypes";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { IntlShape } from "react-intl";

import { useGiftCardTimelineNoteAddMutation } from "../mutations";
import { GIFT_CARD_DETAILS_QUERY } from "../queries";
import { GiftCardAddNote } from "../types/GiftCardAddNote";
import { GiftCardDetails_giftCard_events } from "../types/GiftCardDetails";
import useGiftCardHistoryEvents from "./hooks/useGiftCardHistoryEvents";
import {
  giftCardHistoryMessages as messages,
  giftCardHistoryTimelineMessages as timelineMessages
} from "./messages";
import useStyles from "./styles";

interface FormData {
  message: string;
}

const getEventMessage = (
  event: GiftCardDetails_giftCard_events,
  intl: IntlShape
) => {
  const getUserOrApp = () => {
    if (event.user) {
      const { firstName, lastName, email } = event.user;

      if (lastName === "" || firstName === "") {
        return email;
      }

      return `${firstName} ${lastName}`;
    }

    if (event.app) {
      return event.app.name;
    }
  };

  const getUserOrAppLink = () => {
    if (event.user) {
      return customerPath(event.user.id);
    }

    if (event.app) {
      return appPath(event.app.id);
    }
  };

  switch (event.type) {
    case GiftCardEventsEnum.ACTIVATED:
      return intl.formatMessage(timelineMessages.giftCardActivated, {
        activatedBy: (
          <Link href={staffMemberDetailsPath(event.user.id)}>
            {getUserOrApp()}
          </Link>
        )
      });
    case GiftCardEventsEnum.BALANCE_RESET:
      return intl.formatMessage(timelineMessages.giftCardBalanceReset, {
        resetBy: (
          <Link href={staffMemberDetailsPath(event.user.id)}>
            {getUserOrApp()}
          </Link>
        )
      });
    case GiftCardEventsEnum.BOUGHT:
      return intl.formatMessage(timelineMessages.giftCardBought, {
        orderNumber: (
          <Link href={orderPath(event.orderId)}>#{event.orderNumber}</Link>
        )
      });
    case GiftCardEventsEnum.DEACTIVATED:
      return intl.formatMessage(timelineMessages.giftCardDeactivated, {
        deactivatedBy: (
          <Link href={staffMemberDetailsPath(event.user.id)}>
            {getUserOrApp()}
          </Link>
        )
      });
    case GiftCardEventsEnum.EXPIRY_DATE_UPDATED:
      return intl.formatMessage(timelineMessages.giftCardExpiryDateUpdate, {
        expiryUpdatedBy: (
          <Link href={staffMemberDetailsPath(event.user.id)}>
            {getUserOrApp()}
          </Link>
        )
      });
    case GiftCardEventsEnum.ISSUED:
      return intl.formatMessage(timelineMessages.giftCardIssued, {
        issuedBy: (
          <Link href={staffMemberDetailsPath(event.user.id)}>
            {getUserOrApp()}
          </Link>
        )
      });
    case GiftCardEventsEnum.RESENT:
      return intl.formatMessage(timelineMessages.giftCardResent);
    case GiftCardEventsEnum.SENT_TO_CUSTOMER:
      return intl.formatMessage(timelineMessages.giftCardSentToCustomer);
    case GiftCardEventsEnum.TAGS_UPDATED:
      return intl.formatMessage(timelineMessages.giftCardTagsUpdated);
    case GiftCardEventsEnum.UPDATED:
      return intl.formatMessage(timelineMessages.giftCardTagsUpdated);
    case GiftCardEventsEnum.USED_IN_ORDER:
      return intl.formatMessage(timelineMessages.giftCardUsedInOrder, {
        orderLink: (
          <Link href={orderPath(event.orderId)}>#{event.orderNumber}</Link>
        ),
        buyer: content =>
          getUserOrApp() ? (
            <Link
              href={getUserOrAppLink()}
            >{`${content} ${getUserOrApp()}`}</Link>
          ) : null
      });
  }
};

const GiftCardHistory: React.FC = () => {
  const intl = useIntl();
  const notify = useNotifier();
  const { id, events } = useGiftCardHistoryEvents();
  const classes = useStyles();

  const onTimelineNoteAddCompleted = ({ giftCardAddNote }: GiftCardAddNote) => {
    const { errors } = giftCardAddNote;

    if (errors.length > 0) {
      notify({
        status: "error",
        text: intl.formatMessage(messages.noteAddError)
      });
    } else {
      notify({
        status: "success",
        text: intl.formatMessage(messages.noteAddedSuccessfully)
      });
    }
  };

  const [addTimelineNote, { loading }] = useGiftCardTimelineNoteAddMutation({
    refetchQueries: [GIFT_CARD_DETAILS_QUERY],
    onCompleted: onTimelineNoteAddCompleted
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
        <Skeleton>
          {events && (
            <>
              <Form
                initial={{ message: "" }}
                onSubmit={onNoteAdd}
                resetOnSubmit
              >
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
                    <TimelineEvent
                      key={id}
                      date={date}
                      title={getEventMessage(event, intl)}
                    />
                  );
                })}
            </>
          )}
        </Skeleton>
      </Timeline>
    </div>
  );
};

export default GiftCardHistory;
