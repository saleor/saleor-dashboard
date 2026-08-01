import { ButtonGroupWithDropdown } from "@dashboard/components/ButtonGroupWithDropdown";
import { SetupChecklist } from "@dashboard/components/SetupChecklist/SetupChecklist";
import {
  type SetupChecklistReviewItem,
  type SetupChecklistTask,
} from "@dashboard/components/SetupChecklist/types";
import { ExtensionsPaths } from "@dashboard/extensions/urls";
import { type TaxCalculationStrategy } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { productListUrl } from "@dashboard/products/urls";
import { taxConfigurationListUrl } from "@dashboard/taxes/urls";
import { Box, Button, Text, useTheme } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { ArrowRight, CreditCard, Package, Receipt, Truck, Warehouse } from "lucide-react";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import styles from "./ChannelSetupCard.module.css";
import { getTaxStatusMessage } from "./getTaxStatusMessage";
import { messages } from "./messages";

interface ChannelSetupCardProps {
  /** Tax settings URL uses tax configuration id, not channel id. */
  taxConfigurationId?: string | null;
  chargeTaxes?: boolean | null;
  taxCalculationStrategy?: TaxCalculationStrategy | null;
  channelSlug?: string;
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
  /** When false, footer shows Activate (enabled after warehouse + shipping). */
  isActive?: boolean;
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
  warehouseCount,
  shippingZoneCount,
  availableWarehousesCount,
  availableShippingZonesCount,
  paymentAppsCount,
  publishedProductCount,
  totalProductCount,
  isActive = false,
  canCreateWarehouse,
  canAssignWarehouse,
  onAssignWarehouse,
  onCreateWarehouse,
  onAssignShipping,
  onCreateShipping,
  onActivate,
  activateDisabled = false,
  onDismiss,
}: ChannelSetupCardProps) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const { theme } = useTheme();
  const hasWarehouse = warehouseCount > 0;
  const shippingStatusKnown = shippingZoneCount !== undefined;
  const hasShipping = (shippingZoneCount ?? 0) > 0;
  // Don't block Activate when shipping zones couldn't be loaded.
  const coreReady = hasWarehouse && (!shippingStatusKnown || hasShipping);
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
        <Button variant="primary" data-test-id="setup-assign-warehouse" onClick={onAssignWarehouse}>
          <CtaLabel>
            <FormattedMessage {...messages.warehouseAssign} />
          </CtaLabel>
        </Button>
      )
    ) : canCreateWarehouse ? (
      <Button variant="primary" data-test-id="setup-create-warehouse" onClick={onCreateWarehouse}>
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
        <Button variant="primary" data-test-id="setup-create-shipping" onClick={onCreateShipping}>
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

  const reviewItems: SetupChecklistReviewItem[] = [
    {
      id: "tax",
      icon: <Receipt size={16} />,
      title: <FormattedMessage {...messages.taxTitle} />,
      description: <FormattedMessage {...messages.taxDescription} />,
      status: (
        <FormattedMessage {...getTaxStatusMessage({ chargeTaxes, taxCalculationStrategy })} />
      ),
      onClick: () => navigate(taxConfigurationListUrl(taxConfigurationId ?? undefined)),
      disabled: !taxConfigurationId,
    },
    {
      id: "payments",
      icon: <CreditCard size={16} />,
      title: <FormattedMessage {...messages.paymentsTitle} />,
      description: (
        <FormattedMessage
          {...(paymentAppsCount === 0
            ? messages.paymentsDescriptionNone
            : messages.paymentsDescription)}
        />
      ),
      status:
        paymentAppsCount === undefined ? undefined : paymentAppsCount === 0 ? (
          <FormattedMessage {...messages.paymentsStatusNone} />
        ) : (
          <FormattedMessage
            {...messages.paymentsStatusCount}
            values={{ count: paymentAppsCount }}
          />
        ),
      onClick: () => navigate(ExtensionsPaths.installedExtensions),
    },
    {
      id: "catalog",
      icon: <Package size={16} />,
      title: <FormattedMessage {...messages.catalogTitle} />,
      description: <FormattedMessage {...messages.catalogDescription} />,
      status:
        publishedProductCount === undefined || totalProductCount === undefined ? undefined : (
          <FormattedMessage
            {...messages.catalogStatusPublished}
            values={{ published: publishedProductCount, total: totalProductCount }}
          />
        ),
      onClick: () => navigate(productListUrl(channelSlug ? { channel: channelSlug } : undefined)),
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
                <Button variant="tertiary" onClick={onDismiss} data-test-id="setup-dismiss">
                  <FormattedMessage
                    {...(coreReady ? messages.dismissComplete : messages.dismiss)}
                  />
                </Button>
              )}
              {showActivate && (
                <Button
                  variant="primary"
                  onClick={onActivate}
                  disabled={!coreReady || activateDisabled}
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
