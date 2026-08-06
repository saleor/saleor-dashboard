import { type ChannelSectionId } from "@dashboard/channels/components/ChannelSectionNav/channelSectionIds";
import { useChannelReviewItems } from "@dashboard/channels/hooks/useChannelReviewItems";
import { ButtonGroupWithDropdown } from "@dashboard/components/ButtonGroupWithDropdown";
import { SetupChecklist } from "@dashboard/components/SetupChecklist/SetupChecklist";
import { type SetupChecklistTask } from "@dashboard/components/SetupChecklist/types";
import { type TaxCalculationStrategy } from "@dashboard/graphql";
import { Box, Button, Text, useTheme } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { ArrowRight, Truck, Warehouse } from "lucide-react";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import styles from "./ChannelSetupCard.module.css";
import { messages } from "./messages";

interface ChannelSetupCardProps {
  /** Tax settings URL uses tax configuration id, not channel id. */
  taxConfigurationId?: string | null;
  chargeTaxes?: boolean | null;
  taxCalculationStrategy?: TaxCalculationStrategy | null;
  channelSlug?: string;
  channel?: {
    id: string;
    name: string;
    slug: string;
    currencyCode: string;
  };
  warehouseCount: number;
  /**
   * Zones assigned to this channel. `undefined` when the shipping query was
   * skipped (missing MANAGE_SHIPPING) — don't treat as "0 zones".
   */
  shippingZoneCount?: number;
  /** Total warehouses in the shop (for equipped vs greenfield). */
  availableWarehousesCount: number;
  /** Total shipping zones in the shop (for equipped vs greenfield). */
  availableShippingZonesCount: number;
  /** Active apps that declare HANDLE_PAYMENTS. */
  paymentAppsCount?: number;
  /** Products available in this channel. */
  publishedProductCount?: number;
  /** All products in the shop. */
  totalProductCount?: number;
  /** Channel detail sections the review rows may scroll to. */
  scrollableSectionIds?: ChannelSectionId[];
  /** When false, footer shows Activate (enabled after warehouse + shipping). */
  isActive?: boolean;
  /**
   * Saved (server) warehouse+shipping readiness for Activate.
   * Checklist counts may include unsaved staged assigns; Activate must not.
   * Defaults to checklist `coreReady` when omitted.
   */
  activateReady?: boolean;
  /** `createWarehouse` requires MANAGE_PRODUCTS. */
  canCreateWarehouse: boolean;
  /**
   * Assigning needs warehouses searchable in the UI
   * (MANAGE_PRODUCTS | MANAGE_ORDERS | MANAGE_SHIPPING).
   */
  canAssignWarehouse: boolean;
  onAssignWarehouse: () => void;
  onCreateWarehouse: () => void;
  onAssignShipping: () => void;
  onCreateShipping: () => void;
  onActivate?: () => void;
  /** Disables Activate while the mutation is in flight. */
  activateDisabled?: boolean;
  /** Disables setup CTAs while the channel form is saving/loading. */
  disabled?: boolean;
  onDismiss?: () => void;
}

const REQUIRED_STEPS = 2;

const CtaLabel = ({ children }: { children: ReactNode }) => (
  <Box display="flex" alignItems="center" gap={1}>
    {children}
    <ArrowRight size={14} aria-hidden />
  </Box>
);

export const ChannelSetupCard = ({
  taxConfigurationId,
  chargeTaxes,
  taxCalculationStrategy,
  channelSlug,
  channel,
  warehouseCount,
  shippingZoneCount,
  availableWarehousesCount,
  availableShippingZonesCount,
  paymentAppsCount,
  publishedProductCount,
  totalProductCount,
  scrollableSectionIds,
  isActive = false,
  activateReady,
  canCreateWarehouse,
  canAssignWarehouse,
  onAssignWarehouse,
  onCreateWarehouse,
  onAssignShipping,
  onCreateShipping,
  onActivate,
  activateDisabled = false,
  disabled = false,
  onDismiss,
}: ChannelSetupCardProps) => {
  const intl = useIntl();
  const { theme } = useTheme();
  const reviewItems = useChannelReviewItems({
    taxConfigurationId,
    chargeTaxes,
    taxCalculationStrategy,
    channel,
    channelSlug,
    paymentAppsCount,
    publishedProductCount,
    totalProductCount,
    channelWarehouseCount: warehouseCount,
    shopWarehouseCount: availableWarehousesCount,
    scrollableSectionIds,
  });
  const hasWarehouse = warehouseCount > 0;
  const shippingStatusKnown = shippingZoneCount !== undefined;
  const hasShipping = (shippingZoneCount ?? 0) > 0;
  // Checklist progress from local/staged counts (may include unsaved assigns).
  const coreReady = hasWarehouse && (!shippingStatusKnown || hasShipping);
  // Activate stays on saved server readiness when the parent passes it.
  const canActivate = activateReady ?? coreReady;
  const hasUnassignedWarehouses = canAssignWarehouse && availableWarehousesCount > warehouseCount;
  const canAssignShipping =
    shippingStatusKnown && availableShippingZonesCount > (shippingZoneCount ?? 0);
  const warehouseActionsAvailable = canCreateWarehouse || hasUnassignedWarehouses;
  const requiredDone =
    Number(hasWarehouse) + Number(shippingStatusKnown ? hasShipping : hasWarehouse);
  const showActivate = !isActive && !!onActivate;

  const warehouseAction = !hasWarehouse ? (
    hasUnassignedWarehouses ? (
      canCreateWarehouse ? (
        <ButtonGroupWithDropdown
          variant="primary"
          onClick={onAssignWarehouse}
          testId="setup-assign-warehouse"
          disabled={disabled}
          options={[
            {
              label: intl.formatMessage(messages.warehouseCreate),
              testId: "setup-create-warehouse",
              onSelect: onCreateWarehouse,
            },
          ]}
        >
          <CtaLabel>
            <FormattedMessage {...messages.warehouseAssign} />
          </CtaLabel>
        </ButtonGroupWithDropdown>
      ) : (
        <Button
          variant="primary"
          type="button"
          data-test-id="setup-assign-warehouse"
          onClick={onAssignWarehouse}
          disabled={disabled}
        >
          <CtaLabel>
            <FormattedMessage {...messages.warehouseAssign} />
          </CtaLabel>
        </Button>
      )
    ) : canCreateWarehouse ? (
      <Button
        variant="primary"
        type="button"
        data-test-id="setup-create-warehouse"
        onClick={onCreateWarehouse}
        disabled={disabled}
      >
        <CtaLabel>
          <FormattedMessage {...messages.warehouseCreate} />
        </CtaLabel>
      </Button>
    ) : undefined
  ) : undefined;

  // Locked / permission-blocked shipping has no CTA — the requirement pill is enough.
  const shippingAction =
    shippingStatusKnown && !hasShipping && hasWarehouse ? (
      canAssignShipping ? (
        <ButtonGroupWithDropdown
          variant="primary"
          onClick={onAssignShipping}
          testId="setup-assign-shipping"
          disabled={disabled}
          options={[
            {
              label: intl.formatMessage(messages.shippingCreate),
              testId: "setup-create-shipping",
              onSelect: onCreateShipping,
            },
          ]}
        >
          <CtaLabel>
            <FormattedMessage {...messages.shippingAssign} />
          </CtaLabel>
        </ButtonGroupWithDropdown>
      ) : (
        <Button
          variant="primary"
          type="button"
          data-test-id="setup-create-shipping"
          onClick={onCreateShipping}
          disabled={disabled}
        >
          <CtaLabel>
            <FormattedMessage {...messages.shippingCreate} />
          </CtaLabel>
        </Button>
      )
    ) : undefined;

  const tasks: SetupChecklistTask[] = [
    {
      id: "warehouse",
      title: <FormattedMessage {...messages.warehouseTitle} />,
      description: hasWarehouse ? (
        <FormattedMessage {...messages.warehouseDone} values={{ count: warehouseCount }} />
      ) : !warehouseActionsAvailable ? (
        <FormattedMessage {...messages.warehouseDescriptionNoPermission} />
      ) : hasUnassignedWarehouses ? (
        <FormattedMessage {...messages.warehouseDescriptionAssign} />
      ) : (
        <FormattedMessage {...messages.warehouseDescription} />
      ),
      status: hasWarehouse ? "completed" : warehouseActionsAvailable ? "active" : "locked",
      requirement:
        !hasWarehouse && !warehouseActionsAvailable ? (
          <FormattedMessage {...messages.warehousePermissionRequired} />
        ) : undefined,
      details: <FormattedMessage {...messages.warehouseDetails} />,
      detailsIcon: <Warehouse size={16} />,
      action: warehouseAction,
    },
    {
      id: "shipping",
      title: <FormattedMessage {...messages.shippingTitle} />,
      description: !shippingStatusKnown ? (
        <FormattedMessage {...messages.shippingDescriptionNoPermission} />
      ) : hasShipping ? (
        <FormattedMessage {...messages.shippingDone} values={{ count: shippingZoneCount }} />
      ) : canAssignShipping ? (
        <FormattedMessage {...messages.shippingDescriptionAssign} />
      ) : (
        <FormattedMessage {...messages.shippingDescription} />
      ),
      status: !shippingStatusKnown
        ? "locked"
        : hasShipping
          ? "completed"
          : !hasWarehouse
            ? "locked"
            : "active",
      requirement: !shippingStatusKnown ? (
        <FormattedMessage {...messages.shippingPermissionRequired} />
      ) : !hasWarehouse && !hasShipping ? (
        <FormattedMessage {...messages.shippingRequiresWarehouse} />
      ) : undefined,
      details: <FormattedMessage {...messages.shippingDetails} />,
      detailsIcon: <Truck size={16} />,
      action: shippingAction,
    },
  ];

  const nextUpTask = !hasWarehouse
    ? intl.formatMessage(messages.warehouseTitle)
    : shippingStatusKnown && !hasShipping
      ? intl.formatMessage(messages.shippingTitle)
      : null;

  return (
    <Box paddingX={6} paddingTop={6} marginBottom={10}>
      <SetupChecklist
        className={clsx(styles.elevated, theme === "defaultDark" && styles.elevatedDark)}
        data-test-id="channel-setup-card"
        title={<FormattedMessage {...messages.title} />}
        subtitle={
          coreReady ? (
            <FormattedMessage {...messages.allDone} />
          ) : (
            <FormattedMessage {...messages.subtitle} />
          )
        }
        progress={{ done: requiredDone, total: REQUIRED_STEPS }}
        tasksSection={{
          title: <FormattedMessage {...messages.tasksSectionTitle} />,
        }}
        tasks={tasks}
        reviewSection={{
          title: <FormattedMessage {...messages.reviewSectionTitle} />,
          subtitle: <FormattedMessage {...messages.reviewSectionSubtitle} />,
          items: reviewItems,
        }}
        nextUp={
          nextUpTask ? (
            <FormattedMessage
              {...messages.nextUp}
              values={{
                task: (
                  <Text as="span" size={2} fontWeight="medium" color="default1">
                    {nextUpTask}
                  </Text>
                ),
              }}
            />
          ) : (
            <FormattedMessage {...messages.nextUpDone} />
          )
        }
        footerActions={
          onDismiss || showActivate ? (
            <>
              {onDismiss && (
                <Button
                  variant="tertiary"
                  type="button"
                  onClick={onDismiss}
                  disabled={disabled}
                  data-test-id="setup-dismiss"
                >
                  <FormattedMessage
                    {...(coreReady ? messages.dismissComplete : messages.dismiss)}
                  />
                </Button>
              )}
              {showActivate && (
                <Button
                  variant="primary"
                  type="button"
                  onClick={onActivate}
                  disabled={!canActivate || activateDisabled || disabled}
                  data-test-id="setup-activate-channel"
                >
                  <FormattedMessage {...messages.activateChannel} />
                </Button>
              )}
            </>
          ) : undefined
        }
      />
    </Box>
  );
};
