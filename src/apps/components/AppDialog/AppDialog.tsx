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
      <DashboardModal.Content>
        <DashboardModal.Title display="flex" justifyContent="space-between" alignItems="center">
          {title}
          <DashboardModal.Close onClose={onClose}></DashboardModal.Close>
        </DashboardModal.Title>
        <Box __width={600} __height={600}>
          {children}
        </Box>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

export default AppDialog;
