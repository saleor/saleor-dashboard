import { DashboardModal } from "@dashboard/components/Modal";
import { useAnalytics } from "@dashboard/components/ProductAnalytics/useAnalytics";
import { allRipples } from "@dashboard/ripples/allRipples";
import { useRippleStorage } from "@dashboard/ripples/hooks/useRipplesStorage";
import { rippleIntroducedRipples } from "@dashboard/ripples/ripples/introducedRipples";
import { Ripple } from "@dashboard/ripples/types";
import { Box, Button, ModalRootProps, Text } from "@saleor/macaw-ui-next";
import { useEffect } from "react";
import { useIntl } from "react-intl";

export const getRipplesSortedAndGroupedByMonths = (ripples: Ripple[]) =>
  ripples
    .sort((r1, r2) => r2.dateAdded.getTime() - r1.dateAdded.getTime())
    .reduce(
      (acc, ripple) => {
        const logYear = ripple.dateAdded.getFullYear();
        const logMonth = ripple.dateAdded.toLocaleString("default", { month: "long" });
        const monthKey = `${logYear} ${logMonth}`;

        if (!acc[monthKey]) {
          acc[monthKey] = [];
        }

        acc[monthKey].push({
          ripple: ripple,
          dateDisplay: ripple.dateAdded.toLocaleDateString("default", {
            month: "long",
            year: "numeric",
          }),
        });

        return acc;
      },
      {} as Record<
        string,
        Array<{
          ripple: Ripple;
          dateDisplay: string;
        }>
      >,
    );

const groupedRipples = getRipplesSortedAndGroupedByMonths(allRipples);

// todo idea: show last change instead of "recent changes", ripple should be visible if something new exists
export const AllRipplesModal = (props: Omit<ModalRootProps, "children">) => {
  const intl = useIntl();
  const { hideAllRipples, setManuallyHidden } = useRippleStorage();
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    if (props.open) {
      trackEvent("ripples.modal-opened");
      setManuallyHidden(rippleIntroducedRipples);
    }
  }, [props.open, trackEvent]);

  return (
    <DashboardModal {...props}>
      <DashboardModal.Content size="sm">
        <DashboardModal.Grid>
          <DashboardModal.Header>Recent changes</DashboardModal.Header>
          <Box>
            {Object.values(groupedRipples).map(monthGroup => {
              return (
                <Box key={monthGroup[0].dateDisplay} marginBottom={8}>
                  <Text marginBottom={4} display="block" color="default2">
                    {monthGroup[0].dateDisplay}
                  </Text>
                  {monthGroup
                    .map(items => items.ripple)
                    .map(ripple => {
                      return (
                        <Box key={ripple.ID} marginBottom={4}>
                          <Text display="block" fontSize={4} fontWeight="bold" marginBottom={4}>
                            {ripple.content.oneLiner}
                          </Text>
                          <Text>{ripple.content.global}</Text>
                        </Box>
                      );
                    })}
                </Box>
              );
            })}
          </Box>
          <DashboardModal.Actions>
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
          </DashboardModal.Actions>
        </DashboardModal.Grid>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
