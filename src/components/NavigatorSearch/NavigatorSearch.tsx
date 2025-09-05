import { HotkeysProvider, useHotkeys } from "react-hotkeys-hook";

import { DashboardModal } from "../Modal";
import { CommandContent } from "./CommandContent";
import { useNavigatorSearchContext } from "./useNavigatorSearchContext";

// TODO: probably can be fully handled by https://github.com/pacocoursey/cmdk
const NavigatorSearch = () => {
  const { isNavigatorVisible, setNavigatorVisibility } = useNavigatorSearchContext();

  useHotkeys(
    "ctrl+k, meta+k",
    event => {
      event.preventDefault();
      setNavigatorVisibility(!isNavigatorVisible);

      return false;
    },
    { enableOnFormTags: true },
  );

  const handleCloseMenu = () => {
    setNavigatorVisibility(false);
  };

  return (
    <DashboardModal open={isNavigatorVisible} onChange={handleCloseMenu}>
      <DashboardModal.Content
        __width="100%"
        __maxWidth="720px"
        __height="420px"
        __maxHeight="420px"
        backgroundColor="default1"
        padding={0}
        paddingBottom={4}
        size="sm"
        className="command-menu"
        overflowY="hidden"
      >
        <HotkeysProvider initiallyActiveScopes={["command-menu"]}>
          <CommandContent />
        </HotkeysProvider>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

export default NavigatorSearch;
