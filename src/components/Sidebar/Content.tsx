import { useCloud } from "@dashboard/auth/hooks/useCloud";
import { AllRipplesModal } from "@dashboard/ripples/components/AllRipplesModal";
import { useAllRipplesModalState } from "@dashboard/ripples/state";
import { Box } from "@saleor/macaw-ui-next";

import { Menu } from "./menu";
import { EnvironmentLink } from "./menu/EnvironmentLink";
import { MountingPoint } from "./MountingPoint";
import { UserInfo } from "./user";

export const SidebarContent = () => {
  const { isAuthenticatedViaCloud } = useCloud();
  const { isModalOpen, setModalState } = useAllRipplesModalState();

  return (
    <Box
      backgroundColor="default2"
      as="aside"
      height="100%"
      display="grid"
      __gridTemplateRows="auto 1fr auto"
    >
      <MountingPoint />
      <Menu />
      <Box>
        {isAuthenticatedViaCloud && (
          <Box paddingX={5} paddingBottom={2}>
            <EnvironmentLink />
          </Box>
        )}
        <UserInfo />
      </Box>
      <AllRipplesModal
        open={isModalOpen}
        onChange={open => {
          setModalState(open);
        }}
      />
    </Box>
  );
};
