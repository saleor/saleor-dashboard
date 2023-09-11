import { Metadata } from "@dashboard/components/Metadata";
import { OrderLineFragment } from "@dashboard/graphql";
import { buttonMessages, commonMessages } from "@dashboard/intl";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { Box, Button, Text } from "@saleor/macaw-ui/next";
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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Text variant="heading">
          <FormattedMessage {...commonMessages.metadata} />:{" "}
          {data?.productName ?? ""}
        </Text>
      </DialogTitle>
      <DialogContent>
        <Box __width={550}>
          <Metadata
            readonly={true}
            onChange={() => {}}
            data={{
              metadata: data?.variant?.metadata,
              privateMetadata: data?.variant?.privateMetadata,
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button data-test-id="back" variant="secondary" onClick={onClose}>
          <FormattedMessage {...buttonMessages.cancel} />
        </Button>
      </DialogActions>
    </Dialog>
  );
};
