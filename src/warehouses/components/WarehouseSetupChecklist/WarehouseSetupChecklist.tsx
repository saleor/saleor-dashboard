import { useAnalytics } from "@dashboard/components/ProductAnalytics/useAnalytics";
import { SetupChecklist } from "@dashboard/components/SetupChecklist/SetupChecklist";
import { type SetupChecklistTask } from "@dashboard/components/SetupChecklist/types";
import { messages } from "@dashboard/warehouses/messages";
import { Button, Text, useTheme } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import {
  buildWarehouseChannelTask,
  buildWarehouseShippingZoneTask,
} from "./buildWarehouseSetupTasks";
import styles from "./WarehouseSetupChecklist.module.css";

interface WarehouseSetupChecklistProps {
  canManage: boolean;
  /** The location is already in at least one channel. */
  inChannel?: boolean;
  /**
   * Older stock mode: a shipping zone is required before customers in a country
   * can buy this stock. Direct stock mode omits this step.
   */
  showShippingZones?: boolean;
  /** Zones that share a channel with this location (not outside-channel-only links). */
  zoneCount?: number;
  /**
   * True when a usable zone is linked, or the zone list is truncated so we cannot
   * claim one is missing. Drives completion — not raw zoneCount alone.
   */
  hasUsableShippingZone?: boolean;
  canManageShipping?: boolean;
  onAddChannel: () => void;
  onAddShippingZone?: () => void;
  onDismiss?: () => void;
}

export const WarehouseSetupChecklist = ({
  canManage,
  inChannel = false,
  showShippingZones = false,
  zoneCount = 0,
  hasUsableShippingZone = zoneCount > 0,
  canManageShipping = false,
  onAddChannel,
  onAddShippingZone,
  onDismiss,
}: WarehouseSetupChecklistProps): ReactNode => {
  const intl = useIntl();
  const { theme } = useTheme();
  const { trackEvent } = useAnalytics();
  const channelTitle = intl.formatMessage(messages.setupChannelTitle);
  const zoneTitle = intl.formatMessage(messages.setupZoneTitle);
  const coreReady = inChannel && (!showShippingZones || hasUsableShippingZone);
  const requiredDone = showShippingZones
    ? Number(inChannel) + Number(hasUsableShippingZone)
    : Number(inChannel);
  const requiredTotal = showShippingZones ? 2 : 1;
  const nextUpTask = !inChannel
    ? channelTitle
    : showShippingZones && !hasUsableShippingZone
      ? zoneTitle
      : null;

  const tasks: SetupChecklistTask[] = [
    buildWarehouseChannelTask({
      title: channelTitle,
      inChannel,
      canManage,
      onAddChannel,
    }),
  ];

  if (showShippingZones) {
    tasks.push(
      buildWarehouseShippingZoneTask({
        title: zoneTitle,
        inChannel,
        zoneCount,
        hasUsableShippingZone,
        canManageShipping,
        onAddShippingZone,
      }),
    );
  }

  return (
    <SetupChecklist
      className={clsx(styles.elevated, theme === "defaultDark" && styles.elevatedDark)}
      data-test-id="warehouse-setup-checklist"
      title={<FormattedMessage {...messages.setupTitle} />}
      subtitle={
        coreReady ? (
          <FormattedMessage {...messages.setupSubtitleDone} />
        ) : (
          <FormattedMessage {...messages.setupSubtitle} />
        )
      }
      progress={{ done: requiredDone, total: requiredTotal }}
      tasksSection={{
        title: <FormattedMessage {...messages.channelsRequired} />,
      }}
      tasks={tasks}
      nextUp={
        nextUpTask ? (
          <FormattedMessage
            {...messages.setupNextUp}
            values={{
              task: (
                <Text as="span" size={2} fontWeight="medium" color="default1">
                  {nextUpTask}
                </Text>
              ),
            }}
          />
        ) : (
          <FormattedMessage {...messages.setupNextUpDone} />
        )
      }
      footerActions={
        onDismiss ? (
          <Button
            variant="tertiary"
            type="button"
            onClick={() => {
              trackEvent("setup_checklist_dismissed", {
                completed_steps: requiredDone,
                core_ready: coreReady,
                entity_type: "warehouse",
                total_steps: requiredTotal,
              });
              onDismiss();
            }}
            data-test-id="setup-dismiss"
          >
            <FormattedMessage {...messages.setupDismissComplete} />
          </Button>
        ) : undefined
      }
    />
  );
};

WarehouseSetupChecklist.displayName = "WarehouseSetupChecklist";
