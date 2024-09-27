import { DashboardModal } from "@dashboard/components/Modal";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";

interface AppDialogProps {
  title?: string;
  onClose: () => void;
  open: boolean;
}

export const AppDialog: React.FC<AppDialogProps> = ({ children, title, onClose, ...props }) => {
  return (
    <DashboardModal aria-labelledby="extension app dialog" {...props} onChange={onClose}>
      <DashboardModal.Content size="lg">
        <DashboardModal.Header onClose={onClose} as="h2">
          {title}
        </DashboardModal.Header>
        <Box width="100%" __height={600}>
          {children}
        </Box>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

export default AppDialog;
