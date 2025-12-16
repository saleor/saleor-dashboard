// @ts-strict-ignore
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { TransactionActionEnum } from "@dashboard/graphql";
import { TransactionFakeEvent } from "@dashboard/orders/types";
import { Accordion, Box } from "@saleor/macaw-ui-next";
import { ChevronDown } from "lucide-react";
import * as React from "react";
import { useState } from "react";

import { OrderTransactionCardTitle } from "./components";
import { TransactionEvents } from "./components/TransactionEvents";
import styles from "./OrderTransaction.module.css";
import { ExtendedOrderTransaction } from "./types";
import { getTransactionEvents } from "./utils";

export interface OrderTransactionProps {
  transaction: ExtendedOrderTransaction;
  fakeEvents?: TransactionFakeEvent[];
  onTransactionAction: (transactionId: string, actionType: TransactionActionEnum) => void;
  showActions?: boolean;
  cardFooter?: React.ReactNode;
  disabled?: boolean;
  defaultExpanded?: boolean;
}

const OrderTransaction = ({
  transaction,
  fakeEvents,
  onTransactionAction,
  showActions,
  cardFooter,
  disabled = false,
  defaultExpanded = true,
}: OrderTransactionProps) => {
  const events = getTransactionEvents(transaction, fakeEvents);
  const [expanded, setExpanded] = useState<string | undefined>(
    defaultExpanded ? transaction.id : undefined,
  );

  return (
    <Box
      __opacity={disabled ? "0.6" : "1"}
      data-test-id="orderTransactionsList"
      marginTop={4}
      marginX={6}
    >
      <Accordion value={expanded} onValueChange={setExpanded}>
        <Accordion.Item value={transaction.id}>
          <Box
            backgroundColor="default2"
            borderRadius={4}
            borderStyle="solid"
            borderColor="default1"
            borderWidth={1}
            overflow="hidden"
          >
            <Accordion.Trigger>
              <Box paddingY={4} paddingX={5} width="100%">
                <OrderTransactionCardTitle
                  transaction={transaction}
                  onTransactionAction={onTransactionAction}
                  showActions={showActions}
                  chevron={
                    <Box className={styles.chevron}>
                      <ChevronDown
                        size={iconSize.small}
                        strokeWidth={iconStrokeWidthBySize.small}
                      />
                    </Box>
                  }
                />
              </Box>
            </Accordion.Trigger>

            <Accordion.Content>
              <Box
                borderTopStyle="solid"
                borderColor="default1"
                borderTopWidth={1}
                backgroundColor="default1"
              >
                <TransactionEvents events={events} />
                {cardFooter}
              </Box>
            </Accordion.Content>
          </Box>
        </Accordion.Item>
      </Accordion>
    </Box>
  );
};

export default OrderTransaction;
