import { Accordion, Text } from "@saleor/macaw-ui-next";
import React, { useState } from "react";

import { DiscountRule } from "../../types";

interface RuleProps {
  rule: DiscountRule;
}

const AccordionItemId = "ruleItem";

export const Rule = ({ rule }: RuleProps) => {
  const { name } = rule;
  const [collapsedId, setCollapsedId] = useState("");
  const isCollapsed = collapsedId === AccordionItemId;

  return (
    <Accordion value={collapsedId} onValueChange={setCollapsedId}>
      <Accordion.Item
        value={AccordionItemId}
        borderRadius={4}
        borderColor="neutralPlain"
        borderWidth={1}
        borderStyle="solid"
        backgroundColor={
          isCollapsed ? "surfaceNeutralSubdued" : "surfaceNeutralPlain"
        }
        padding={4}
      >
        <Accordion.Trigger>
          <Text variant="heading">Catalog rule</Text>
          <Accordion.TriggerButton />
        </Accordion.Trigger>
        <Accordion.Content>
          <Text>{name}</Text>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
};
