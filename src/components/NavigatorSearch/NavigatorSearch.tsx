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
        className="command-menu"
        disableScrollLayout
        size="picker"
        __height="420px"
        __maxHeight="420px"
        overflowY="hidden"
        padding={0}
      >
        <HotkeysProvider initiallyActiveScopes={["command-menu"]}>
          <CommandContent />
        </HotkeysProvider>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

export default NavigatorSearch;
