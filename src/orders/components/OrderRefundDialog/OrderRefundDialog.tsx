import { DashboardModal } from "@dashboard/components/Modal";
import * as RadixRadioGroup from "@radix-ui/react-radio-group";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import React from "react";

import { RadioTile } from "./RadioTile";

interface OrderRefundDialogProps {
  open: boolean;
  onChange: () => void;
}

type RefundType = "standard" | "misc";

export const OrderRefundDialog = ({
  open,
  onChange,
}: OrderRefundDialogProps) => {
  const [selected, setSelected] = React.useState<RefundType>("standard");

  const handleClose = () => {
    setSelected("standard");
    onChange();
  };
  return (
    <DashboardModal open={open} onChange={handleClose}>
      <DashboardModal.Content __width="400px">
        <DashboardModal.Title>Create a new refund</DashboardModal.Title>
        <Text>How do you want to make a refund?</Text>
        <RadixRadioGroup.Root
          asChild
          value={selected}
          onValueChange={val => setSelected(val as RefundType)}
        >
          <Box
            as="fieldset"
            borderWidth={0}
            margin={0}
            padding={0}
            gap={4}
            display="flex"
            flexDirection="column"
          >
            <RadioTile
              value={"standard"}
              checked={selected === "standard"}
              title="Refund with line items"
              description="The purchased product list will be sent and used to suggest amount to refund."
            />
            <RadioTile
              value={"misc"}
              checked={selected === "misc"}
              title="Refund with manual amount"
              description="Do not use information about the products and rely on amount provided manually."
            />
          </Box>
        </RadixRadioGroup.Root>

        {/* </Box> */}
        <DashboardModal.Actions>
          <Button onClick={onChange} variant="secondary">
            <Text fontWeight="medium">Back</Text>
          </Button>
          <Button onClick={onChange}>
            {" "}
            <Text fontWeight="medium" color="buttonDefaultPrimary">
              Confirm
            </Text>
          </Button>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
