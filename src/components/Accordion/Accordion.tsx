import {
  Accordion as AccordionMacaw,
  Box,
  Divider,
  sprinkles,
  Text,
} from "@saleor/macaw-ui/next";
import React, { useState } from "react";

export interface AccordionProps {
  className?: string;
  initialExpand?: boolean;
  quickPeek?: React.ReactNode;
  title: string;
}

const AccordionItemId = "accordionItemId";

const Accordion: React.FC<AccordionProps> = ({
  children,
  initialExpand,
  quickPeek,
  title,
  className,
}) => {
  const [openedAccordionId, setOpendAccordionId] = useState<undefined | string>(
    !!initialExpand ? AccordionItemId : undefined,
  );

  return (
    <div className={className}>
      <AccordionMacaw
        value={openedAccordionId}
        onValueChange={value => setOpendAccordionId(value)}
        className={sprinkles({
          borderStyle: "solid",
          borderWidth: 1,
          borderColor: "neutralPlain",
          paddingX: 4,
          borderRadius: 5,
        })}
      >
        <AccordionMacaw.Item value={AccordionItemId}>
          <AccordionMacaw.Trigger>
            <Text paddingY={3} variant="body" size="small">
              {title}
            </Text>
            <AccordionMacaw.TriggerButton dataTestId="expand-icon" />
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
