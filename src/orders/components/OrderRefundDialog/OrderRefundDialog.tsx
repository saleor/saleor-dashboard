import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import * as RadixRadioGroup from "@radix-ui/react-radio-group";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { orderRefundDialogMesages } from "./messages";
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
  const intl = useIntl();

  const handleClose = () => {
    setSelected("standard");
    onChange();
  };
  return (
    <DashboardModal open={open} onChange={handleClose}>
      <DashboardModal.Content __width="400px">
        <DashboardModal.Title>
          {intl.formatMessage(orderRefundDialogMesages.title)}
        </DashboardModal.Title>
        <Text>{intl.formatMessage(orderRefundDialogMesages.subtitle)}</Text>
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
              title={intl.formatMessage(
                orderRefundDialogMesages.standardRefundTitle,
              )}
              description={intl.formatMessage(
                orderRefundDialogMesages.standardRefundSubtitle,
              )}
            />
            <RadioTile
              value={"misc"}
              checked={selected === "misc"}
              title={intl.formatMessage(
                orderRefundDialogMesages.miscRefundTitle,
              )}
              description={intl.formatMessage(
                orderRefundDialogMesages.miscRefundSubtitle,
              )}
            />
          </Box>
        </RadixRadioGroup.Root>
        <DashboardModal.Actions>
          <Button onClick={onChange} variant="secondary">
            <Text fontWeight="medium">
              {intl.formatMessage(buttonMessages.confirm)}
            </Text>
          </Button>
          <Button onClick={onChange}>
            {" "}
            <Text fontWeight="medium" color="buttonDefaultPrimary">
              {intl.formatMessage(buttonMessages.cancel)}
            </Text>
          </Button>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
