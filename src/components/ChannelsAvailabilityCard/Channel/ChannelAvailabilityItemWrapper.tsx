// @ts-strict-ignore
import { type ChannelData } from "@dashboard/channels/utils";
import { Title2 } from "@dashboard/components/Title2/Title2";
import Label from "@dashboard/orders/components/OrderHistory/Label";
import { Accordion } from "@saleor/macaw-ui-next";
import type * as React from "react";

import { type Messages } from "../types";

interface ChannelContentWrapperProps {
  data: ChannelData;
  children: React.ReactNode;
  messages: Messages;
}

export const ChannelAvailabilityItemWrapper = ({
  data: { name },
  messages,
  children,
}: ChannelContentWrapperProps) => (
  <Accordion data-test-id="channel-availability-item">
    <Accordion.Item value="channel-availability-item" gap={9}>
      <Accordion.Trigger>
        <Title2>{name}</Title2>
        <Label text={messages.availableDateText} />
        <Accordion.TriggerButton dataTestId="expand-icon" />
      </Accordion.Trigger>
      <Accordion.Content paddingLeft={3}>{children}</Accordion.Content>
    </Accordion.Item>
  </Accordion>
);
