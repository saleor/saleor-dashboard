import { Name } from "@dashboard/featureFlags/availableFlags";
import { Box, Button, CloseIcon, Modal } from "@saleor/macaw-ui/next";
import React, { ReactNode } from "react";

import { Content } from "./Content";
import { FlagList } from "./FlagList";
import { Header } from "./Header";
import { NoFlags } from "./NoFlags";
import { useFlagsState } from "./useFlagsState";

interface FeatureFlagsModalProps {
  children: ReactNode;
}

export const FeatureFlagsModal = ({ children }: FeatureFlagsModalProps) => {
  const { selectedFlag, hasNoFlags, changeTab } = useFlagsState();

  const handleTabClick = (tabName: Name) => {
    changeTab(tabName);
  };

  return (
    <Modal>
      <Modal.Trigger>{children}</Modal.Trigger>
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
                  flagSlug={selectedFlag.name}
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
