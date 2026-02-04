import githubLogo from "@assets/images/github-logo.svg";
import { DashboardModal } from "@dashboard/components/Modal";
import { useAnalytics } from "@dashboard/components/ProductAnalytics/useAnalytics";
import { getStatusColor, PillStatusType } from "@dashboard/misc";
import { allRipples } from "@dashboard/ripples/allRipples";
import { useRippleStorage } from "@dashboard/ripples/hooks/useRipplesStorage";
import { rippleIntroducedRipples } from "@dashboard/ripples/ripples/introducedRipples";
import { Ripple, RippleType } from "@dashboard/ripples/types";
import { Box, Button, ModalRootProps, Text, useTheme, vars } from "@saleor/macaw-ui-next";
import { ChevronRightIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import SVG from "react-inlinesvg";
import { defineMessages, useIntl } from "react-intl";

interface RippleEntry {
  ripple: Ripple;
  dateDisplay: string;
}

export const getRipplesSortedAndGroupedByMonths = (
  ripples: Ripple[],
): Record<string, RippleEntry[]> =>
  ripples
    .sort((r1, r2) => r2.dateAdded.getTime() - r1.dateAdded.getTime())
    .reduce<Record<string, RippleEntry[]>>((acc, ripple) => {
      const logYear = ripple.dateAdded.getFullYear();
      const logMonth = ripple.dateAdded.toLocaleString("default", { month: "long" });
      const monthKey = `${logYear} ${logMonth}`;

      if (!acc[monthKey]) {
        acc[monthKey] = [];
      }

      acc[monthKey].push({
        ripple,
        dateDisplay: ripple.dateAdded.toLocaleDateString("default", {
          month: "short",
          year: "numeric",
        }),
      });

      return acc;
    }, {});

const groupedRipples = getRipplesSortedAndGroupedByMonths(allRipples);
const flattenedRipples = Object.values(groupedRipples).flat();

const rippleTypeToPillStatus: Record<RippleType, PillStatusType> = {
  feature: "success",
  improvement: "info",
  bugfix: "error",
};

const rippleTypeMessages = defineMessages({
  feature: {
    id: "lZTwh4",
    defaultMessage: "Feature",
  },
  improvement: {
    id: "cpI605",
    defaultMessage: "Improvement",
  },
  bugfix: {
    id: "RUwHjA",
    defaultMessage: "Bug Fix",
  },
});

const TypeBadge = ({ type }: { type: RippleType }) => {
  const intl = useIntl();
  const { theme: currentTheme } = useTheme();
  const colors = getStatusColor({ status: rippleTypeToPillStatus[type], currentTheme });

  return (
    <Box
      as="span"
      paddingX={2}
      paddingY={0.5}
      borderRadius={2}
      fontSize={1}
      fontWeight="medium"
      __backgroundColor={colors.base}
      __color={colors.text}
      __borderColor={colors.border}
      borderWidth={1}
      borderStyle="solid"
    >
      {intl.formatMessage(rippleTypeMessages[type])}
    </Box>
  );
};

const RippleActionContent = ({ label, isHovered }: { label: string; isHovered: boolean }) => (
  <>
    <Text
      fontSize={3}
      __color={vars.colors.text.accent1}
      textDecoration={isHovered ? "underline" : "none"}
    >
      {label}
    </Text>
    <Box
      __color={vars.colors.text.accent1}
      __transition="transform 0.2s ease"
      __transform={isHovered ? "translateX(4px)" : "translateX(0)"}
      display="flex"
      alignItems="center"
    >
      <ChevronRightIcon size={16} />
    </Box>
  </>
);

const RippleAction = ({ action }: { action: NonNullable<Ripple["actions"]>[number] }) => {
  const intl = useIntl();
  const [isHovered, setIsHovered] = useState(false);
  const label = intl.formatMessage(action.label);

  if (action.href) {
    return (
      <Box
        as="a"
        href={action.href}
        target="_blank"
        rel="noopener noreferrer"
        display="flex"
        alignItems="center"
        gap={1}
        marginTop={3}
        cursor="pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        textDecoration="none"
      >
        <RippleActionContent label={label} isHovered={isHovered} />
      </Box>
    );
  }

  return (
    <Box
      as="button"
      display="flex"
      alignItems="center"
      gap={1}
      marginTop={3}
      cursor="pointer"
      onClick={action.onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      backgroundColor="transparent"
      borderWidth={0}
      padding={0}
    >
      <RippleActionContent label={label} isHovered={isHovered} />
    </Box>
  );
};

interface RippleEntryRowProps {
  ripple: Ripple;
  dateDisplay: string;
  isLast: boolean;
}

const RippleEntryRow = ({ ripple, dateDisplay, isLast }: RippleEntryRowProps) => {
  return (
    <Box display="flex" gap={4}>
      {/* Timeline column - dot and line */}
      <Box display="flex" flexDirection="column" alignItems="center" __width="6px" __minWidth="6px">
        {/* Dot container - same height as date row for alignment */}
        <Box display="flex" alignItems="center" __height="20px">
          <Box
            __width="6px"
            __height="6px"
            __minWidth="6px"
            __minHeight="6px"
            borderRadius="100%"
            __backgroundColor={vars.colors.text.default1}
          />
        </Box>
        {/* Connecting line */}
        {!isLast && <Box __width="1px" __flexGrow="1" backgroundColor="default1Hovered" />}
      </Box>

      {/* Content column */}
      <Box __flexGrow="1" paddingBottom={6}>
        {/* Date and Type badge row */}
        <Box display="flex" alignItems="center" gap={3} marginBottom={3} __height="20px">
          <Text as="span" fontSize={2} color="default2">
            {dateDisplay}
          </Text>
          <TypeBadge type={ripple.type} />
        </Box>

        {/* Title */}
        <Text
          as="h3"
          display="block"
          fontSize={4}
          fontWeight="bold"
          marginBottom={2}
          color="default1"
        >
          {ripple.content.oneLiner}
        </Text>

        {/* Description - always use consistent color */}
        <Text fontSize={3} color="default2" __lineHeight="1.6">
          {ripple.content.global}
        </Text>

        {/* Actions - filter out actions marked as hideInModal */}
        {ripple.actions
          ?.filter(action => !action.hideInModal)
          .map((action, index) => (
            <RippleAction key={`${ripple.ID}-action-${index}`} action={action} />
          ))}
      </Box>
    </Box>
  );
};

export const AllRipplesModal = (props: Omit<ModalRootProps, "children">) => {
  const intl = useIntl();
  const { hideAllRipples, setManuallyHidden } = useRippleStorage();
  const { trackEvent } = useAnalytics();

  const lastUpdatedDate = useMemo(() => {
    const latestRipple = allRipples.reduce((latest, ripple) =>
      ripple.dateAdded > latest.dateAdded ? ripple : latest,
    );

    return latestRipple.dateAdded.toLocaleDateString("default", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, [allRipples]);

  useEffect(() => {
    if (props.open) {
      trackEvent("ripples.modal-opened");
      setManuallyHidden(rippleIntroducedRipples);
    }
  }, [props.open, trackEvent, setManuallyHidden]);

  return (
    <DashboardModal {...props}>
      <DashboardModal.Content size="sm">
        <DashboardModal.Grid gap={0}>
          {/* Header */}
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Text as="h1" fontSize={6} fontWeight="bold" color="default1" marginBottom={1}>
                  {intl.formatMessage({
                    defaultMessage: "What's New",
                    id: "RKHBh0",
                  })}
                </Text>
                <Text fontSize={3} color="default2">
                  {intl.formatMessage({
                    defaultMessage: "Latest updates and improvements",
                    id: "ctdEON",
                  })}
                </Text>
              </Box>
              <DashboardModal.Close onClose={() => props.onChange?.(false)} />
            </Box>
            {/* Bottom border - full width */}
            <Box
              marginTop={4}
              __marginLeft="calc(var(--mu-spacing-6) * -1)"
              __marginRight="calc(var(--mu-spacing-6) * -1)"
              borderTopWidth={1}
              borderTopStyle="solid"
              borderColor="default1Hovered"
            />
          </Box>

          {/* Content */}
          <Box __maxHeight="500px" overflowY="auto" paddingRight={2} paddingY={4}>
            {flattenedRipples.map((entry, index) => (
              <RippleEntryRow
                key={entry.ripple.ID}
                ripple={entry.ripple}
                dateDisplay={entry.dateDisplay}
                isLast={index === flattenedRipples.length - 1}
              />
            ))}
          </Box>

          {/* Footer - negative horizontal margins for full-width borders, negative bottom to remove modal padding */}
          <Box
            __marginLeft="calc(var(--mu-spacing-6) * -1)"
            __marginRight="calc(var(--mu-spacing-6) * -1)"
            __marginBottom="calc(var(--mu-spacing-6) * -1)"
          >
            {/* Top border */}
            <Box borderTopWidth={1} borderTopStyle="solid" borderColor="default1Hovered" />

            {/* Buttons section */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              paddingX={6}
              paddingY={4}
            >
              <Button
                variant="secondary"
                onClick={() => {
                  hideAllRipples();

                  if (props.onChange) {
                    props.onChange(false);
                  }
                }}
              >
                {intl.formatMessage({
                  defaultMessage: "Close and hide all hints",
                  id: "pJ5/7G",
                })}
              </Button>
              <Button onClick={() => props.onChange && props.onChange(false)}>
                {intl.formatMessage({
                  defaultMessage: "Close",
                  id: "rbrahO",
                })}
              </Button>
            </Box>

            {/* Last updated section */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              paddingX={6}
              paddingY={2}
              backgroundColor="default2"
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Text fontSize={1} color="default2">
                  {intl.formatMessage(
                    {
                      defaultMessage: "Last updated: {date}",
                      id: "ZdCdo5",
                    },
                    { date: lastUpdatedDate },
                  )}
                  ,{" "}
                </Text>
                <Box
                  as="a"
                  href="https://github.com/saleor/saleor-dashboard/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  display="flex"
                  alignItems="center"
                  gap={1}
                  __opacity={{ default: "0.7", hover: "1" }}
                  __color={vars.colors.text.default2}
                  textDecoration={{ default: "none", hover: "underline" }}
                  fontSize={1}
                >
                  <SVG src={githubLogo} width={12} height={12} />
                  {intl.formatMessage({
                    defaultMessage: "Releases",
                    id: "JEw8ys",
                  })}
                </Box>
              </Box>
              <Box
                as="a"
                href="https://github.com/saleor/saleor-dashboard/issues/new"
                target="_blank"
                rel="noopener noreferrer"
                display="flex"
                alignItems="center"
                gap={1}
                fontSize={1}
                __color={vars.colors.text.accent1}
                textDecoration={{ default: "none", hover: "underline" }}
              >
                {intl.formatMessage({
                  defaultMessage: "Suggest a change",
                  id: "FN+iLO",
                })}
                <ChevronRightIcon size={12} />
              </Box>
            </Box>
          </Box>
        </DashboardModal.Grid>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
