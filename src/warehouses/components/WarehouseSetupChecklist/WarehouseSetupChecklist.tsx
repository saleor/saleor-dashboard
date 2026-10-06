import { useAnalytics } from "@dashboard/components/ProductAnalytics/useAnalytics";
import { SetupChecklist } from "@dashboard/components/SetupChecklist/SetupChecklist";
import {
  type SetupChecklistReviewItem,
  type SetupChecklistTask,
} from "@dashboard/components/SetupChecklist/types";
import { messages } from "@dashboard/warehouses/messages";
import { Box, Button, Text, useTheme } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { ArrowRight, Truck } from "lucide-react";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import styles from "./WarehouseSetupChecklist.module.css";

const CtaLabel = ({ children }: { children: ReactNode }): ReactNode => (
  <Box display="flex" alignItems="center" gap={1}>
    {children}
    <ArrowRight size={14} aria-hidden />
  </Box>
);

interface WarehouseSetupChecklistProps {
  canManage: boolean;
  /** The location is already in at least one channel. */
  inChannel?: boolean;
  /** Older stock mode: a shipping zone still affects which countries can buy this stock. */
  showShippingZones?: boolean;
  zoneCount?: number;
  onAddChannel: () => void;
  onOpenShippingZones?: () => void;
  onDismiss?: () => void;
}

export const WarehouseSetupChecklist = ({
  canManage,
  inChannel = false,
  showShippingZones = false,
  zoneCount = 0,
  onAddChannel,
  onOpenShippingZones,
  onDismiss,
}: WarehouseSetupChecklistProps): ReactNode => {
  const intl = useIntl();
  const { theme } = useTheme();
  const { trackEvent } = useAnalytics();
  const taskTitle = intl.formatMessage(messages.setupChannelTitle);
  const tasks: SetupChecklistTask[] = [
    {
      id: "channel",
      title: taskTitle,
      description: <FormattedMessage {...messages.channelsBanner} />,
      status: inChannel ? "completed" : canManage ? "active" : "locked",
      requirement:
        inChannel || canManage ? undefined : (
          <FormattedMessage {...messages.setupChannelPermission} />
        ),
      action:
        !inChannel && canManage ? (
          <Button
            variant="primary"
            type="button"
            data-test-id="warehouse-setup-add-channel"
            onClick={onAddChannel}
          >
            <CtaLabel>
              <FormattedMessage {...messages.channelsBannerAction} />
            </CtaLabel>
          </Button>
        ) : undefined,
    },
  ];

  const reviewItems: SetupChecklistReviewItem[] =
    showShippingZones && onOpenShippingZones
      ? [
          {
            id: "shipping-zones",
            icon: <Truck size={16} />,
            title: <FormattedMessage {...messages.zonesTitle} />,
            description: <FormattedMessage {...messages.setupReviewZonesDescription} />,
            status:
              zoneCount === 0 ? (
                <FormattedMessage {...messages.setupReviewZonesNone} />
              ) : zoneCount === 1 ? (
                <FormattedMessage {...messages.setupReviewZonesOne} />
              ) : (
                <FormattedMessage
                  {...messages.setupReviewZonesCount}
                  values={{ count: zoneCount }}
                />
              ),
            onClick: onOpenShippingZones,
          },
        ]
      : [];

  return (
    <SetupChecklist
      className={clsx(styles.elevated, theme === "defaultDark" && styles.elevatedDark)}
      data-test-id="warehouse-setup-checklist"
      title={<FormattedMessage {...messages.setupTitle} />}
      subtitle={<FormattedMessage {...messages.setupSubtitle} />}
      tasksSection={{
        title: <FormattedMessage {...messages.channelsRequired} />,
      }}
      tasks={tasks}
      reviewSection={
        reviewItems.length > 0
          ? {
              title: <FormattedMessage {...messages.setupReviewTitle} />,
              subtitle: <FormattedMessage {...messages.setupReviewSubtitle} />,
              items: reviewItems,
            }
          : undefined
      }
      nextUp={
        inChannel ? (
          <FormattedMessage {...messages.setupNextUpDone} />
        ) : (
          <FormattedMessage
            {...messages.setupNextUp}
            values={{
              task: (
                <Text as="span" size={2} fontWeight="medium" color="default1">
                  {taskTitle}
                </Text>
              ),
            }}
          />
        )
      }
      footerActions={
        onDismiss ? (
          <Button
            variant="tertiary"
            type="button"
            onClick={() => {
              trackEvent("setup_checklist_dismissed", {
                completed_steps: inChannel ? 1 : 0,
                core_ready: inChannel,
                entity_type: "warehouse",
                total_steps: 1,
              });
              onDismiss();
            }}
            data-test-id="setup-dismiss"
          >
            <FormattedMessage
              {...(inChannel ? messages.setupDismissComplete : messages.setupDismiss)}
            />
          </Button>
        ) : undefined
      }
    />
  );
};

WarehouseSetupChecklist.displayName = "WarehouseSetupChecklist";
