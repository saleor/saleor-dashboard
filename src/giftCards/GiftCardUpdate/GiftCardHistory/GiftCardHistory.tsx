import { Link, Typography } from "@material-ui/core";
import Form from "@saleor/components/Form";
import Hr from "@saleor/components/Hr";
import Skeleton from "@saleor/components/Skeleton";
import Timeline, {
  TimelineAddNote,
  TimelineEvent,
  TimelineNote
} from "@saleor/components/Timeline";
import useNotifier from "@saleor/hooks/useNotifier";
import { orderPath } from "@saleor/orders/urls";
import { staffMemberDetailsPath } from "@saleor/staff/urls";
import { GiftCardEventsEnum } from "@saleor/types/globalTypes";
import React, { useContext } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { IntlShape } from "react-intl";

import { useGiftCardTimelineNoteAddMutation } from "../mutations";
import { GiftCardDetailsContext } from "../providers/GiftCardDetailsProvider";
import { GIFT_CARD_DETAILS_QUERY } from "../queries";
import { GiftCardAddNote } from "../types/GiftCardAddNote";
import { GiftCardDetails_giftCard_events } from "../types/GiftCardDetails";
import messages from "./messages";
import useStyles from "./styles";

interface FormData {
  message: string;
}

const useGiftCardHistoryEvents = () => {
  const { giftCard } = useContext(GiftCardDetailsContext);

  return { id: giftCard?.id, events: giftCard?.events };
};

const getEventMessage = (
  event: GiftCardDetails_giftCard_events,
  intl: IntlShape
) => {
  const getUserOrApp = () => {
    if (event.user) {
      const { firstName, lastName } = event.user;
      return `${firstName} ${lastName}`;
    }
    if (event.app) {
      return event.app.name;
    }
  };

  switch (event.type) {
    case GiftCardEventsEnum.ACTIVATED:
      return intl.formatMessage(
        {
          defaultMessage: "Gift card was activated by {activatedBy}",
          description: "gift card history message"
        },
        {
          activatedBy: (
            <Link href={staffMemberDetailsPath(event.user.id)}>
              {getUserOrApp()}
            </Link>
          )
        }
      );
    case GiftCardEventsEnum.BALANCE_RESET:
      return intl.formatMessage(
        {
          defaultMessage: "Gift card balance was reset by {resetBy}",
          description: "gift card history message"
        },
        {
          resetBy: (
            <Link href={staffMemberDetailsPath(event.user.id)}>
              {getUserOrApp()}
            </Link>
          )
        }
      );
    case GiftCardEventsEnum.BOUGHT:
      return intl.formatMessage(
        {
          defaultMessage: "Gift card was bought in order #{orderNumber}",
          description: "gift card history message"
        },
        {
          orderNumber: event.orderId
        }
      );
    case GiftCardEventsEnum.DEACTIVATED:
      return intl.formatMessage(
        {
          defaultMessage: "Gift card was deactivated by {deactivatedBy}",
          description: "gift card history message"
        },
        {
          deactivatedBy: (
            <Link href={staffMemberDetailsPath(event.user.id)}>
              {getUserOrApp()}
            </Link>
          )
        }
      );
    case GiftCardEventsEnum.EXPIRY_DATE_UPDATED:
      return intl.formatMessage(
        {
          defaultMessage:
            "Gift card expiry date was updated by {expiryUpdatedBy}",
          description: "gift card history message"
        },
        {
          expiryUpdatedBy: (
            <Link href={staffMemberDetailsPath(event.user.id)}>
              {getUserOrApp()}
            </Link>
          )
        }
      );
    case GiftCardEventsEnum.ISSUED:
      return intl.formatMessage(
        {
          defaultMessage: "Gift card was issued by {issuedBy}",
          description: "dsc"
        },
        {
          issuedBy: (
            <Link href={staffMemberDetailsPath(event.user.id)}>
              {getUserOrApp()}
            </Link>
          )
        }
      );
    case GiftCardEventsEnum.RESENT:
      return intl.formatMessage({
        defaultMessage: "Gift card was resent",
        description: "gift card history message"
      });
    case GiftCardEventsEnum.SENT_TO_CUSTOMER:
      return intl.formatMessage({
        defaultMessage: "Gift card was sent to customer",
        description: "gift card history message"
      });
    case GiftCardEventsEnum.TAG_UPDATED:
      return intl.formatMessage({
        defaultMessage: "Gift card tag was updated",
        description: "gift card history message"
      });
    case GiftCardEventsEnum.UPDATED:
      return intl.formatMessage({
        defaultMessage: "Gift card was updated",
        description: "gift card history message"
      });
    case GiftCardEventsEnum.USED_IN_ORDER:
      return intl.formatMessage(
        {
          defaultMessage:
            "Gift card was used as a payment method on order {orderLink}",
          description: "gift card history message"
        },
        {
          orderLink: (
            <Link href={orderPath(event.orderId)}>#{event.orderNumber}</Link>
          )
        }
      );
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

  const [addTimelineNote] = useGiftCardTimelineNoteAddMutation({
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
