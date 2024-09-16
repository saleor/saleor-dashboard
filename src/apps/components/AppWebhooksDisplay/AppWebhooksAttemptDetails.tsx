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
      marginX={2}
      borderRadius={4}
      borderStyle="solid"
      borderWidth={1}
      borderColor={{
        default: "default1",
        hover: "default1Hovered",
      }}
      backgroundColor={{
        hover: "default1Hovered",
      }}
      paddingTop={1}
      marginBottom={2}
    >
      <Box display="flex" gap={4} key={id}>
        <Text display="block">
          <Text color="default2">Status</Text>:{" "}
          <Text color={status === "FAILED" ? "critical1" : "default1"} fontWeight="bold">
            {status}
          </Text>
        </Text>
        <Text display="block" size={3}>
          <Text color="default2">HTTP</Text>{" "}
          <Text color="critical1" fontWeight="bold">
            {responseStatusCode}
          </Text>
        </Text>
        <Text display="block" size={3} marginLeft="auto" fontWeight="bold">
          {new Date(createdAt).toLocaleString()}
        </Text>
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
