import { DashboardModal } from "@dashboard/components/Modal";
import { allRipples } from "@dashboard/ripples/all-ripples";
import { Ripple } from "@dashboard/ripples/types";
import { Box, Button, ModalRootProps, Text } from "@saleor/macaw-ui-next";

const logsSorted = allRipples.sort((r1, r2) => r2.dateAdded.getTime() - r1.dateAdded.getTime());

const logsByMonths = logsSorted.reduce(
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

export const AllRipplesModal = (props: Omit<ModalRootProps, "children">) => {
  return (
    <DashboardModal {...props}>
      <DashboardModal.Content size="sm">
        <DashboardModal.Grid>
          <DashboardModal.Header>Recent changes</DashboardModal.Header>
          <Box>
            {Object.values(logsByMonths).map((monthGroup, index) => {
              return (
                <Box key={`${monthGroup}-${index}`} marginBottom={8}>
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
            <Button variant="secondary">Close and hide all hints</Button>
            <Button onClick={() => props.onChange && props.onChange(false)}>Close</Button>
          </DashboardModal.Actions>
        </DashboardModal.Grid>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
