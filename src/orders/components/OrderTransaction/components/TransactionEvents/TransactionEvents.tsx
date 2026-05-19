import { type TransactionEventFragment } from "@dashboard/graphql";
import { renderCollection } from "@dashboard/misc";
import { type TransactionFakeEvent } from "@dashboard/orders/types";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

import { EventItem } from "./components";
import { messages } from "./messages";
import styles from "./TransactionEvents.module.css";

interface OrderTransactionEventsProps {
  events: TransactionEventFragment[] | TransactionFakeEvent[];
}

export const TransactionEvents = ({ events }: OrderTransactionEventsProps) => {
  const [hoveredPspReference, setHoveredPspReference] = useState<string | null>(null);

  return (
    <table className={styles.table} onMouseLeave={() => setHoveredPspReference(null)}>
      <tbody>
        {renderCollection<TransactionFakeEvent | TransactionEventFragment>(
          events,
          transactionEvent =>
            transactionEvent ? (
              <EventItem
                key={transactionEvent.id}
                event={transactionEvent}
                onHover={setHoveredPspReference}
                hoveredPspReference={hoveredPspReference}
              />
            ) : null,
          () => (
            <tr>
              <td className={styles.noEvent}>
                <FormattedMessage {...messages.noEvents} />
              </td>
            </tr>
          ),
        )}
      </tbody>
    </table>
  );
};
