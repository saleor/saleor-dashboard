import { Box } from "@saleor/macaw-ui-next";
import React, { useState } from "react";

import { DashboardModal } from "../Modal";
import { Actions } from "./Actions";
import NavigatorSearchInput from "./NavigatorSearchInput";
import { Resources } from "./Resources";
import { useKeyboardNavigation } from "./useKeyboardNavigatioin";

const NavigatorSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const { handleKeyDown, isCommandMenuOpen, closeCommandMenu } = useKeyboardNavigation();

  return (
    <DashboardModal open={isCommandMenuOpen} onChange={closeCommandMenu}>
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
        <Box width="100%" onKeyDown={handleKeyDown}>
          <NavigatorSearchInput onSearch={setQuery} value={query} />
          <Actions query={query} />
          <Resources query={query} />
        </Box>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

export default NavigatorSearch;
