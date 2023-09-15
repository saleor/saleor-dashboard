import { Metadata } from "@dashboard/components/Metadata";
import { OrderLineFragment } from "@dashboard/graphql";
import { buttonMessages, commonMessages } from "@dashboard/intl";
import { Box, Button, Modal, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage } from "react-intl";

interface OrderMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  data?: OrderLineFragment;
}

export const OrderMetadataDialog = ({
  onClose,
  open,
  data,
}: OrderMetadataDialogProps) => {
  return (
    <Modal open={open} onChange={onClose}>
      <Modal.Content>
        <Box
          backgroundColor="surfaceNeutralPlain"
          boxShadow="modal"
          borderRadius={2}
          __left="50%"
          __top="50%"
          position="fixed"
          __maxHeight="90vh"
          __width="min(850px, 90vw)"
          overflowY="auto"
          __transform="translate(-50%, -50%)"
          paddingY={4}
        >
          <Text paddingX={6} variant="heading" size="large">
            <FormattedMessage {...commonMessages.metadata} />:{" "}
            {data?.productName ?? ""}
          </Text>

          <Metadata
            readonly={true}
            onChange={() => {}}
            data={{
              metadata: data?.variant?.metadata ?? [],
              privateMetadata: data?.variant?.privateMetadata ?? [],
            }}
          />

          <Box paddingX={6} display="flex" justifyContent="flex-end">
            <Button data-test-id="back" variant="secondary" onClick={onClose}>
              <FormattedMessage {...buttonMessages.close} />
            </Button>
          </Box>
        </Box>
      </Modal.Content>
    </Modal>
  );
};
