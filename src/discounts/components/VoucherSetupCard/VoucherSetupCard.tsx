import { SetupChecklist } from "@dashboard/components/SetupChecklist/SetupChecklist";
import {
  type SetupChecklistReviewItem,
  type SetupChecklistTask,
} from "@dashboard/components/SetupChecklist/types";
import { Box, Button, Text, useTheme } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { ArrowRight, Gauge, Globe, Hash, Percent, ShoppingBag, Store, Tags } from "lucide-react";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { scrollToVoucherSection } from "../VoucherSectionNav/useVoucherSectionScrollSpy";
import { voucherSectionIds } from "../VoucherSectionNav/voucherSectionIds";
import { type VoucherSetupReadiness } from "./getVoucherSetupReadiness";
import { messages } from "./messages";
import styles from "./VoucherSetupCard.module.css";

interface VoucherSetupCardProps {
  readiness: VoucherSetupReadiness;
  disabled?: boolean;
  onDismiss?: () => void;
  onManageChannels: () => void;
  /** Create uses save-gating copy; edit explains redeem readiness. */
  variant?: "create" | "edit";
}

const CtaLabel = ({ children }: { children: ReactNode }) => (
  <Box display="flex" alignItems="center" gap={1}>
    {children}
    <ArrowRight size={14} aria-hidden />
  </Box>
);

const taskStatus = (done: boolean, activeWhenPending: boolean): SetupChecklistTask["status"] => {
  if (done) {
    return "completed";
  }

  return activeWhenPending ? "active" : "pending";
};

export const VoucherSetupCard = ({
  readiness,
  disabled,
  onDismiss,
  onManageChannels,
  variant = "edit",
}: VoucherSetupCardProps) => {
  const intl = useIntl();
  const { theme } = useTheme();
  const isCreate = variant === "create";
  const {
    hasCodes,
    hasChannels,
    hasDiscountValue,
    needsCatalogue,
    hasCatalogue,
    needsCountries,
    hasCountries,
    codesCount,
    channelCount,
    catalogueCount,
    countriesCount,
    coreReady,
  } = readiness;

  // Free shipping has no amount step; countries is reviewable but not a redeem blocker
  // (empty list = worldwide).
  const progressTotal =
    2 + Number(!needsCountries) + Number(needsCatalogue) + Number(needsCountries);
  const progressDone =
    Number(hasCodes) +
    Number(hasChannels) +
    (needsCountries ? 0 : Number(hasDiscountValue)) +
    (needsCatalogue ? Number(hasCatalogue) : 0) +
    (needsCountries ? 1 : 0);

  const codesActive = !hasCodes;
  const channelsActive = hasCodes && !hasChannels;
  const discountActive = !needsCountries && hasCodes && hasChannels && !hasDiscountValue;
  const catalogueActive =
    hasCodes && hasChannels && hasDiscountValue && needsCatalogue && !hasCatalogue;

  const tasks: SetupChecklistTask[] = [
    {
      id: "codes",
      title: <FormattedMessage {...messages.codesTitle} />,
      description: hasCodes ? (
        <FormattedMessage {...messages.codesDone} values={{ count: codesCount }} />
      ) : (
        <FormattedMessage {...messages.codesDescription} />
      ),
      status: taskStatus(hasCodes, codesActive),
      details: <FormattedMessage {...messages.codesDetails} />,
      detailsIcon: <Hash size={16} />,
      action: !hasCodes ? (
        <Button
          variant="primary"
          type="button"
          data-test-id="setup-add-codes"
          onClick={() => scrollToVoucherSection(voucherSectionIds.codes)}
          disabled={disabled}
        >
          <CtaLabel>
            <FormattedMessage {...messages.codesAction} />
          </CtaLabel>
        </Button>
      ) : undefined,
    },
    {
      id: "channels",
      title: <FormattedMessage {...messages.channelsTitle} />,
      description: hasChannels ? (
        <FormattedMessage {...messages.channelsDone} values={{ count: channelCount }} />
      ) : (
        <FormattedMessage {...messages.channelsDescription} />
      ),
      status: taskStatus(hasChannels, channelsActive),
      details: <FormattedMessage {...messages.channelsDetails} />,
      detailsIcon: <Store size={16} />,
      action: !hasChannels ? (
        <Button
          variant="primary"
          type="button"
          data-test-id="setup-manage-channels"
          onClick={onManageChannels}
          disabled={disabled}
        >
          <CtaLabel>
            <FormattedMessage {...messages.channelsAction} />
          </CtaLabel>
        </Button>
      ) : undefined,
    },
  ];

  if (!needsCountries) {
    tasks.push({
      id: "discount",
      title: <FormattedMessage {...messages.discountTitle} />,
      description: hasDiscountValue ? (
        <FormattedMessage {...messages.discountDone} />
      ) : (
        <FormattedMessage {...messages.discountDescription} />
      ),
      status: taskStatus(hasDiscountValue, discountActive),
      details: <FormattedMessage {...messages.discountDetails} />,
      detailsIcon: <Percent size={16} />,
      action: !hasDiscountValue ? (
        <Button
          variant="primary"
          type="button"
          data-test-id="setup-set-discount"
          onClick={() => scrollToVoucherSection(voucherSectionIds.discount)}
          disabled={disabled}
        >
          <CtaLabel>
            <FormattedMessage {...messages.discountAction} />
          </CtaLabel>
        </Button>
      ) : undefined,
    });
  }

  if (needsCatalogue) {
    tasks.push({
      id: "catalogue",
      title: <FormattedMessage {...messages.catalogueTitle} />,
      description: hasCatalogue ? (
        <FormattedMessage {...messages.catalogueDone} values={{ count: catalogueCount }} />
      ) : (
        <FormattedMessage {...messages.catalogueDescription} />
      ),
      status: taskStatus(hasCatalogue, catalogueActive),
      details: <FormattedMessage {...messages.catalogueDetails} />,
      detailsIcon: <Tags size={16} />,
      action: !hasCatalogue ? (
        <Button
          variant="primary"
          type="button"
          data-test-id="setup-assign-catalogue"
          onClick={() => scrollToVoucherSection(voucherSectionIds.catalogue)}
          disabled={disabled}
        >
          <CtaLabel>
            <FormattedMessage {...messages.catalogueAction} />
          </CtaLabel>
        </Button>
      ) : undefined,
    });
  }

  if (needsCountries) {
    tasks.push({
      id: "countries",
      title: <FormattedMessage {...messages.countriesTitle} />,
      description: hasCountries ? (
        <FormattedMessage {...messages.countriesDone} values={{ count: countriesCount }} />
      ) : (
        <FormattedMessage {...messages.countriesWorldwideDone} />
      ),
      // Worldwide (empty) and restricted lists are both redeemable — never a blocker.
      status: "completed",
      details: <FormattedMessage {...messages.countriesDetails} />,
      detailsIcon: <Globe size={16} />,
      action: (
        <Button
          variant="secondary"
          type="button"
          data-test-id="setup-review-countries"
          onClick={() => scrollToVoucherSection(voucherSectionIds.countries)}
          disabled={disabled}
        >
          <CtaLabel>
            <FormattedMessage {...messages.countriesAction} />
          </CtaLabel>
        </Button>
      ),
    });
  }

  const reviewItems: SetupChecklistReviewItem[] = [
    {
      id: "limits",
      icon: <Gauge size={16} />,
      title: <FormattedMessage {...messages.limitsReviewTitle} />,
      description: <FormattedMessage {...messages.limitsReviewDescription} />,
      onClick: () => scrollToVoucherSection(voucherSectionIds.limits),
      disabled,
    },
    {
      id: "requirements",
      icon: <ShoppingBag size={16} />,
      title: <FormattedMessage {...messages.requirementsReviewTitle} />,
      description: <FormattedMessage {...messages.requirementsReviewDescription} />,
      onClick: () => scrollToVoucherSection(voucherSectionIds.requirements),
      disabled,
    },
  ];

  const nextUpTask = !hasCodes
    ? intl.formatMessage(messages.codesTitle)
    : !hasChannels
      ? intl.formatMessage(messages.channelsTitle)
      : !needsCountries && !hasDiscountValue
        ? intl.formatMessage(messages.discountTitle)
        : needsCatalogue && !hasCatalogue
          ? intl.formatMessage(messages.catalogueTitle)
          : null;

  return (
    <Box paddingX={6} paddingTop={6} marginBottom={10}>
      <SetupChecklist
        className={clsx(styles.elevated, theme === "defaultDark" && styles.elevatedDark)}
        data-test-id="voucher-setup-card"
        title={<FormattedMessage {...(isCreate ? messages.titleCreate : messages.title)} />}
        subtitle={
          coreReady ? (
            <FormattedMessage {...messages.allDone} />
          ) : (
            <FormattedMessage {...(isCreate ? messages.subtitleCreate : messages.subtitle)} />
          )
        }
        progress={{ done: progressDone, total: progressTotal }}
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
          onDismiss ? (
            <Button
              variant="tertiary"
              type="button"
              onClick={onDismiss}
              disabled={disabled}
              data-test-id="setup-dismiss"
            >
              <FormattedMessage {...(coreReady ? messages.dismissComplete : messages.dismiss)} />
            </Button>
          ) : undefined
        }
      />
    </Box>
  );
};
