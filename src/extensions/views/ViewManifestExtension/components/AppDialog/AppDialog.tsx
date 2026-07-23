import { DashboardModal } from "@dashboard/components/Modal";
import { Box } from "@saleor/macaw-ui-next";
import { type PropsWithChildren } from "react";

interface AppDialogProps {
  title?: string;
  onClose: () => void;
  open: boolean;
}

export const AppDialog = ({
  children,
  title,
  onClose,
  ...props
}: PropsWithChildren<AppDialogProps>) => {
  return (
    <DashboardModal aria-labelledby="extension app dialog" {...props} onChange={onClose}>
      {/* Fill the viewport-capped modal height so the extension iframe renders
          at full popup height instead of a fixed 600px. */}
      <DashboardModal.Content size="lg" __height="calc(100vh - 100px)">
        <DashboardModal.Header as="h2">{title}</DashboardModal.Header>
        <Box width="100%" __height="100%" __minHeight={0}>
          {children}
        </Box>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
