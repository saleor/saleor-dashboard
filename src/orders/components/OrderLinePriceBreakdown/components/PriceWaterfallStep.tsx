import Money from "@dashboard/components/Money";
import { type MoneyFragment } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";

interface PriceWaterfallStepProps {
  /** Short label, e.g. "Catalogue promotion". */
  label: string;
  /** Optional secondary line: e.g. promotion name, voucher code, reason. */
  detail?: ReactNode;
  /** Money amount associated with the step. Discount steps display as `−$X`,
   *  start/end rows display as plain money, "plus" steps prefix with "+". */
  amount: MoneyFragment;
  /** Sign prefix for the amount: "−" subtracts, "+" adds, "none" is neutral. */
  sign?: "minus" | "plus" | "none";
  /** Running total after this step is applied. Displayed at the right. */
  runningTotal?: MoneyFragment;
  /** Visual emphasis for opening / closing rows of the waterfall. */
  emphasis?: "start" | "end" | "none";
  /** Test id suffix for stable selectors. */
  testIdSuffix?: string;
}

export const PriceWaterfallStep = ({
  label,
  detail,
  amount,
  sign = "minus",
  runningTotal,
  emphasis = "none",
  testIdSuffix,
}: PriceWaterfallStepProps) => {
  const isStart = emphasis === "start";
  const isEnd = emphasis === "end";

  return (
    <Box
      display="grid"
      __gridTemplateColumns="1fr auto auto"
      gap={3}
      alignItems="center"
      paddingY={2}
      paddingX={3}
      borderTopStyle={isStart ? undefined : "solid"}
      borderTopWidth={isStart ? undefined : 1}
      borderColor="default1"
      data-test-id={testIdSuffix ? `price-waterfall-step-${testIdSuffix}` : undefined}
    >
      <Box display="flex" flexDirection="column" gap={0.5} __minWidth={0}>
        <Text
          size={2}
          color={isStart || isEnd ? "default1" : "default2"}
          fontWeight={isEnd ? "bold" : "regular"}
        >
          {label}
        </Text>
        {detail && (
          <Text size={1} color="default1">
            {detail}
          </Text>
        )}
      </Box>

      <Box display="flex" alignItems="baseline" gap={1} justifyContent="flex-end">
        {sign === "minus" && (
          <Text size={2} color="default2">
            &minus;
          </Text>
        )}
        {sign === "plus" && (
          <Text size={2} color="default2">
            +
          </Text>
        )}
        <Text
          size={2}
          color={isEnd ? "default1" : "default2"}
          fontWeight={isEnd ? "bold" : "regular"}
        >
          <Money money={amount} />
        </Text>
      </Box>

      <Box display="flex" justifyContent="flex-end" __minWidth="80px">
        {runningTotal ? (
          <Text size={1} color="default2">
            <Money money={runningTotal} />
          </Text>
        ) : (
          <Text size={1} color="default2">
            &nbsp;
          </Text>
        )}
      </Box>
    </Box>
  );
};
