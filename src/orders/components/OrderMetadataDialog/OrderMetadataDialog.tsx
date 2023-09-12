import { Metadata } from "@dashboard/components/Metadata";
import { OrderLineFragment } from "@dashboard/graphql";
import { buttonMessages, commonMessages } from "@dashboard/intl";
import { Box, Button, CloseIcon, Modal, Text } from "@saleor/macaw-ui/next";
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
          __left="50%"
          __top="50%"
          position="fixed"
          __maxHeight="90vh"
          __width="min(850px, 90vw)"
          overflowY="auto"
          __transform="translate(-50%, -50%)"
          paddingY={5}
        >
          <Box
            paddingX={6}
            marginBottom={5}
            display="flex"
            justifyContent="space-between"
          >
            <Text variant="heading" size="large">
              <FormattedMessage {...commonMessages.metadata} />:{" "}
              {data?.productName ?? ""}
            </Text>

            <Modal.Close>
              <Button variant="tertiary" icon={<CloseIcon />} size="small" />
            </Modal.Close>
          </Box>

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
