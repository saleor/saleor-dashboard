import { Accordion as AccordionMacaw, Box, Divider, sprinkles, Text } from "@saleor/macaw-ui-next";
import React, { useState } from "react";

export interface AccordionProps {
  className?: string;
  initialExpand?: boolean;
  quickPeek?: React.ReactNode;
  title: string;
  dataTestId?: string;
}

const AccordionItemId = "accordionItemId";
const Accordion = ({
  children,
  initialExpand,
  quickPeek,
  title,
  className,
  dataTestId = "expand-icon",
}: AccordionProps) => {
  const [openedAccordionId, setOpendAccordionId] = useState<undefined | string>(
    initialExpand ? AccordionItemId : undefined,
  );

  return (
    <div className={className}>
      <AccordionMacaw
        value={openedAccordionId}
        onValueChange={value => setOpendAccordionId(value)}
        className={sprinkles({
          borderStyle: "solid",
          borderWidth: 1,
          borderColor: "default1",
          paddingX: 4,
          borderRadius: 5,
        })}
      >
        <AccordionMacaw.Item value={AccordionItemId}>
          <AccordionMacaw.Trigger>
            <Text paddingY={3} size={3}>
              {title}
            </Text>
            <AccordionMacaw.TriggerButton dataTestId={dataTestId} />
          </AccordionMacaw.Trigger>
          <AccordionMacaw.Content>
            <Divider />
            <Box paddingY={3}>{children}</Box>
          </AccordionMacaw.Content>
        </AccordionMacaw.Item>

        {!openedAccordionId && !!quickPeek && (
          <>
            <Divider />
            <Box paddingY={4}>{quickPeek}</Box>
          </>
        )}
      </AccordionMacaw>
    </div>
  );
};

Accordion.displayName = "Accordion";
export default Accordion;
