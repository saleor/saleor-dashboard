import { Name } from "@dashboard/featureFlags/availableFlags";
import { Box, Button, CloseIcon, Modal } from "@saleor/macaw-ui/next";
import React from "react";

import { Content } from "./Content";
import { FlagList } from "./FlagList";
import { Header } from "./Header";
import { NoFlags } from "./NoFlags";
import { useFlagsState } from "./useFlagsState";

interface FeatureFlagsModalProps {
  open: boolean;
  onChange: (open: boolean) => void;
}

export const FeatureFlagsModal = ({
  open,
  onChange,
}: FeatureFlagsModalProps) => {
  const { selectedFlag, hasNoFlags, changeTab } = useFlagsState();

  const handleTabClick = (tabName: Name) => {
    changeTab(tabName);
  };

  return (
    <Modal open={open} onChange={onChange}>
      <Modal.Content>
        <Box
          backgroundColor="surfaceNeutralPlain"
          borderRadius={3}
          position="fixed"
          boxShadow="modal"
          overflow="hidden"
          __left="50%"
          __top="50%"
          __width="960px"
          __height="600px"
          __transform="translate(-50%, -50%)"
        >
          <Header>
            <Modal.Close>
              <Button variant="tertiary" icon={<CloseIcon />} size="small" />
            </Modal.Close>
          </Header>
          <Box
            display="flex"
            backgroundColor="surfaceNeutralPlain"
            height="100%"
          >
            {hasNoFlags ? (
              <NoFlags />
            ) : (
              <>
                <FlagList
                  selectedName={selectedFlag.name}
                  onItemClick={handleTabClick}
                />
                <Content
                  flagName={selectedFlag.displayName}
                  flagSlug={selectedFlag.name as Name}
                  component={selectedFlag.component}
                  isEnabled={selectedFlag.content.enabled}
                />
              </>
            )}
          </Box>
        </Box>
      </Modal.Content>
    </Modal>
  );
};
