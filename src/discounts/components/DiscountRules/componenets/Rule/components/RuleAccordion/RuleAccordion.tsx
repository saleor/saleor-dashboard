import { Accordion, Text } from "@saleor/macaw-ui-next";
import React, { ReactNode, useState } from "react";

interface RuleAccordionProps {
  children: ReactNode;
  title: ReactNode;
}

export const RuleAccordion = ({ children, title }: RuleAccordionProps) => {
  const [collapsedId, setCollapsedId] = useState("ruleItem");

  return (
    <Accordion value={collapsedId} onValueChange={setCollapsedId}>
      <Accordion.Item
        value="ruleItem"
        borderRadius={4}
        borderColor="default1"
        borderWidth={1}
        borderStyle="solid"
        padding={4}
        backgroundColor={collapsedId === "ruleItem" ? "default2" : "default1"}
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
