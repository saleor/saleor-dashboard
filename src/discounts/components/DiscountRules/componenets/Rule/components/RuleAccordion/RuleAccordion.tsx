import { Accordion, Text } from "@saleor/macaw-ui-next";
import React, { ReactNode, useState } from "react";

interface RuleAccordionProps {
  children: ReactNode;
  title: ReactNode;
}

const AccordionItemId = "ruleItem";

export const RuleAccordion = ({ children, title }: RuleAccordionProps) => {
  const [collapsedId, setCollapsedId] = useState("");

  return (
    <Accordion value={collapsedId} onValueChange={setCollapsedId}>
      <Accordion.Item
        value={AccordionItemId}
        borderRadius={4}
        borderColor="neutralPlain"
        borderWidth={1}
        borderStyle="solid"
        padding={4}
      >
        <Accordion.Trigger>
          <Text variant="heading">{title}</Text>
          <Accordion.TriggerButton />
        </Accordion.Trigger>
        <Accordion.Content>{children}</Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
};
