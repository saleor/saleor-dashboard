import { DateTime } from "@dashboard/components/Date";
import { EventDeliveryAttemptFragment } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";

interface AppWebhooksAttemptDetailsProps {
  attempt: EventDeliveryAttemptFragment;
}

export const AppWebhooksAttemptDetails: React.FC<AppWebhooksAttemptDetailsProps> = ({
  attempt,
}) => {
  const { createdAt, status, responseStatusCode, response, id } = attempt;

  return (
    <Box
      display="flex"
      flexDirection="column"
      paddingX={2}
      borderRadius={4}
      backgroundColor={{
        hover: "default1Hovered",
      }}
      paddingTop={1}
      borderWidth={1}
    >
      <Box display="flex" gap={4} key={id}>
        <Text display="block" size={3} fontWeight="bold">
          <DateTime plain date={createdAt} />
        </Text>

        <Box display="block" marginLeft="auto">
          <Text color="default2">HTTP</Text>{" "}
          <Text color="critical1" fontWeight="bold" marginRight={4}>
            {responseStatusCode}
          </Text>
          <Text color="default2">Status</Text>:{" "}
          <Text color={status === "FAILED" ? "critical1" : "default1"} fontWeight="bold">
            {status}
          </Text>
        </Box>
      </Box>

      <Box paddingTop={4} paddingBottom={2}>
        <Text
          // @ts-expect-error - "pre" is missing in Text props
          as="pre"
          wordBreak="break-all"
          maxWidth="100%"
          size={3}
          style={{ whiteSpace: "pre-wrap" }}
        >
          {response}
        </Text>
      </Box>
    </Box>
  );
};
