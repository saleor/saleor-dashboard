import { Accordion, sprinkles, Text } from "@saleor/macaw-ui-next";
import { PropsWithChildren } from "react";

interface ChannelListProps {
  summary: string;
}

export const ChannelsList = ({ summary, children }: PropsWithChildren<ChannelListProps>) => (
  <Accordion>
    <Accordion.Item value="channelListItem">
      <Accordion.Trigger
        className={sprinkles({
          paddingX: 6,
          paddingTop: 0,
          paddingBottom: 8,
        })}
      >
        <Text size={2} color="default2">
          {summary}
        </Text>
        <Accordion.TriggerButton dataTestId="expand-icon" />
      </Accordion.Trigger>
      <Accordion.Content>{children}</Accordion.Content>
    </Accordion.Item>
  </Accordion>
);
