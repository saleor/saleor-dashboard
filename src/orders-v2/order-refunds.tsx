import { OrderDetailsFragment, OrderGrantedRefundStatusEnum } from "@dashboard/graphql";
import { getUserInitials } from "@dashboard/misc";
import {
  manualRefundsExtractor,
  mergeRefunds,
} from "@dashboard/orders/components/OrderDetailsRefundTable/refunds";
import { Box, Button, PropsWithBox, Text } from "@saleor/macaw-ui-next";
import { PencilIcon, Undo2 } from "lucide-react";
import { useIntl } from "react-intl";

import { StatusPill } from "./status-pill";

type Props = PropsWithBox<{
  onNewRefund?: () => void;
  onEditRefund?: (refundId: string) => void;
  order: OrderDetailsFragment;
}>;

const getStatusConfig = (status: OrderGrantedRefundStatusEnum) => {
  switch (status) {
    case OrderGrantedRefundStatusEnum.FAILURE:
      return {
        label: "Failure",
        status: "error",
      } as const;
    case OrderGrantedRefundStatusEnum.SUCCESS:
      return {
        label: "Success",
        status: "success",
      } as const;
    case OrderGrantedRefundStatusEnum.PENDING:
      return {
        status: "warning",
        label: "Pending",
      } as const;
    case OrderGrantedRefundStatusEnum.NONE:
    default:
      return {
        status: "warning",
        label: "Draft",
      } as const;
  }
};

const StatusBadge = ({ status }: { status: OrderGrantedRefundStatusEnum }) => {
  const config = getStatusConfig(status);

  return <StatusPill status={config.status}>{config.label}</StatusPill>;
};

const UserAvatar = ({ initials }: { initials: string }) => (
  <Box
    width={8}
    height={8}
    borderRadius="100%"
    borderStyle="solid"
    borderColor="default1"
    display="flex"
    alignItems="center"
    justifyContent="center"
  >
    <Text size={2} fontWeight="medium" color="default1">
      {initials}
    </Text>
  </Box>
);

export const OrderRefunds = ({ onNewRefund, onEditRefund, order }: Props) => {
  const intl = useIntl();

  const manualRefunds = manualRefundsExtractor(order, intl);

  const mergedRefunds = mergeRefunds(order.grantedRefunds ?? [], manualRefunds);

  return (
    <Box padding={6} gap={4} display="grid">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text size={6} fontWeight="medium">
          {intl.formatMessage({
            defaultMessage: "Refunds",
            id: "pXQSzm",
          })}
        </Text>
        <Button variant="secondary" icon={<Undo2 size={16} />} onClick={onNewRefund}>
          {intl.formatMessage({
            defaultMessage: "New Refund",
            id: "DPsabz",
          })}
        </Button>
      </Box>

      <Box as="ul" display="grid" gap={3}>
        {mergedRefunds.length === 0 && (
          <Box as="li" display="flex" justifyContent="center" padding={6}>
            <Text size={3} color="default2">
              {intl.formatMessage({
                defaultMessage: "No refunds made for this order.",
                id: "qs0dIo",
              })}
            </Text>
          </Box>
        )}
        {mergedRefunds.map(refund => (
          <Box
            key={refund.id}
            display="grid"
            __gridTemplateColumns="auto 1fr auto"
            alignItems="center"
            gap={7}
            as="li"
          >
            <Box display="flex" alignItems="center" gap={3}>
              <UserAvatar initials={getUserInitials(refund.user)} />
              <StatusBadge status={refund.status} />
            </Box>
            <Box display="grid" __gridTemplateColumns="auto 1fr" gap={3}>
              <Text size={3} color="default2">
                {intl.formatDate(refund.createdAt, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZoneName: "short",
                })}
              </Text>
              <Text
                size={3}
                color="default2"
                __maxWidth="max-content"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {refund.reason}
              </Text>
            </Box>

            <Box display="flex" alignItems="center" gap={3}>
              <Box display="grid" __gridTemplateColumns="1fr auto" gap={2}>
                <Text size={3} color="default2" fontWeight="medium" fontFamily="Geist Mono">
                  {refund.amount.currency}
                </Text>
                <Text size={4} fontWeight="medium" fontFamily="Geist Mono">
                  {intl.formatNumber(refund.amount.amount, {
                    minimumFractionDigits: 2,
                  })}
                </Text>
              </Box>

              <Button
                variant="secondary"
                icon={<PencilIcon size={16} />}
                onClick={() => onEditRefund?.(refund.id)}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
