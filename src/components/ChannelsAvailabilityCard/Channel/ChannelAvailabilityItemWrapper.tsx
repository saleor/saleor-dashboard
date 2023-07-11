// @ts-strict-ignore
import { ChannelData } from "@dashboard/channels/utils";
import Label from "@dashboard/orders/components/OrderHistory/Label";
import { Accordion, Text } from "@saleor/macaw-ui/next";
import React from "react";

import { Messages } from "../types";

export interface ChannelContentWrapperProps {
  data: ChannelData;
  children: React.ReactNode;
  messages: Messages;
}

export const ChannelAvailabilityItemWrapper: React.FC<
  ChannelContentWrapperProps
> = ({ data: { name }, messages, children }) => (
  <Accordion data-test-id="channel-availability-item">
    <Accordion.Item value="channel-availability-item" gap={9}>
      <Accordion.Trigger>
        <Text variant={"bodyEmp"}>{name}</Text>
        <Label text={messages.availableDateText} />
        <Accordion.TriggerButton dataTestId="expand-icon" />
      </Accordion.Trigger>
      <Accordion.Content paddingLeft={3}>{children}</Accordion.Content>
    </Accordion.Item>
  </Accordion>
);
