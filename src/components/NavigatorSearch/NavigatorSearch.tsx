import { Box } from "@saleor/macaw-ui-next";
import hotkeys from "hotkeys-js";
import React, { useState } from "react";
import { DashboardModal } from "../Modal";
import NavigatorSearchInput from "./NavigatorSearchInput";
import { useNavigatorSearchContext } from "./useNavigatorSearchContext";
import { Actions } from "./Actions";
import { Resources } from "./Resources";

const navigatorHotkey = "ctrl+k, command+k";


const NavigatorSearch: React.FC = () => {
  const { isNavigatorVisible, setNavigatorVisibility } = useNavigatorSearchContext();
  const [query, setQuery] = useState("");
  React.useEffect(() => {
    hotkeys(navigatorHotkey, event => {
      event.preventDefault();
      setNavigatorVisibility(!isNavigatorVisible);
    });

    return () => hotkeys.unbind(navigatorHotkey);
  }, []);


  return (
    <DashboardModal open={isNavigatorVisible} onChange={setNavigatorVisibility}>
      <DashboardModal.Content
        __width="100%"
        __maxWidth="720px"
        __height="420px"
        __maxHeight="420px"
        backgroundColor="default1"
        padding={0}
        paddingBottom={4}
        size="sm"
      >
        <Box width="100%">
          <NavigatorSearchInput onSearch={setQuery} value={query} />
          <Actions query={query} />
          <Resources query={query} />
        </Box>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

export default NavigatorSearch;
