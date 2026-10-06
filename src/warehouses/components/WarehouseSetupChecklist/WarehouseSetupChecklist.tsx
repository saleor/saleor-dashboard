import { SetupChecklist } from "@dashboard/components/SetupChecklist/SetupChecklist";
import { type SetupChecklistTask } from "@dashboard/components/SetupChecklist/types";
import { messages } from "@dashboard/warehouses/messages";
import { Box, Button, Text, useTheme } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { ArrowRight } from "lucide-react";
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
  onAddChannel: () => void;
}

export const WarehouseSetupChecklist = ({
  canManage,
  onAddChannel,
}: WarehouseSetupChecklistProps): ReactNode => {
  const intl = useIntl();
  const { theme } = useTheme();
  const taskTitle = intl.formatMessage(messages.setupChannelTitle);
  const tasks: SetupChecklistTask[] = [
    {
      id: "channel",
      title: taskTitle,
      description: <FormattedMessage {...messages.channelsBanner} />,
      status: canManage ? "active" : "locked",
      requirement: canManage ? undefined : (
        <FormattedMessage {...messages.setupChannelPermission} />
      ),
      action: canManage ? (
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
      nextUp={
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
      }
    />
  );
};

WarehouseSetupChecklist.displayName = "WarehouseSetupChecklist";
