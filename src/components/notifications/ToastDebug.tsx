/**
 * Temporary debug component to preview toast variants
 * Remove this file after styling is finalized
 */
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { GripVertical } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export const ToastDebug = () => {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: window.innerHeight - e.clientY - position.y,
    };

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - dragOffset.current.x,
        y: window.innerHeight - e.clientY - dragOffset.current.y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const showSavedChanges = () => {
    toast.success("Saved changes", {
      description: "Product details have been updated successfully.",
    });
  };

  const showOrderConfirmed = () => {
    toast.success("Order confirmed", {
      description: "Order #12345 has been confirmed and is ready for fulfillment.",
    });
  };

  const showSimpleError = () => {
    toast.error("Something went wrong", {
      description: "Unable to save changes. Please try again.",
      duration: Infinity,
    });
  };

  const showPermissionError = () => {
    toast.error("Permission denied", {
      description: "You don't have permission to perform this action.",
      duration: Infinity,
    });
  };

  const showGraphQLError = () => {
    toast.error("Failed to update product", {
      description: "Product with this SKU already exists.",
      duration: Infinity,
    });
  };

  const showNetworkError = () => {
    toast.error("Network error", {
      description: "Unable to connect to the server. Please try again later.",
      duration: Infinity,
    });
  };

  const showSessionExpiring = () => {
    toast.warning("Session expiring soon", {
      description: "Your session will expire in 5 minutes. Save your work.",
    });
  };

  const showExportStarted = () => {
    toast.info("Export started", {
      description: "Your export is being processed. You'll be notified when it's ready.",
    });
  };

  const showUndoAction = () => {
    toast.success("Product deleted", {
      description: "The product has been moved to trash.",
      action: {
        label: "Undo",
        onClick: () => toast.success("Restored", { description: "Product has been restored." }),
      },
      duration: 8000,
    });
  };

  return (
    <Box
      position="fixed"
      __zIndex={9999}
      backgroundColor="default1"
      padding={4}
      borderRadius={3}
      boxShadow="defaultModal"
      display="flex"
      flexDirection="column"
      gap={3}
      __maxWidth="320px"
      style={{
        left: position.x,
        bottom: position.y,
        cursor: isDragging ? "grabbing" : "default",
        userSelect: "none",
      }}
    >
      {/* Drag handle */}
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        onMouseDown={handleMouseDown}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        <GripVertical size={16} style={{ opacity: 0.5 }} />
        <Text size={3} fontWeight="bold">
          🍞 Toast Preview
        </Text>
      </Box>

      <Box display="flex" flexDirection="column" gap={1}>
        <Text size={1} color="default2" fontWeight="medium">
          SUCCESS
        </Text>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Button variant="secondary" size="small" onClick={showSavedChanges}>
            Saved changes
          </Button>
          <Button variant="secondary" size="small" onClick={showOrderConfirmed}>
            Order confirmed
          </Button>
          <Button variant="secondary" size="small" onClick={showUndoAction}>
            With Undo
          </Button>
        </Box>
      </Box>

      <Box display="flex" flexDirection="column" gap={1}>
        <Text size={1} color="default2" fontWeight="medium">
          ERRORS
        </Text>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Button variant="secondary" size="small" onClick={showSimpleError}>
            Simple
          </Button>
          <Button variant="secondary" size="small" onClick={showPermissionError}>
            Permission
          </Button>
          <Button variant="secondary" size="small" onClick={showGraphQLError}>
            GraphQL
          </Button>
          <Button variant="secondary" size="small" onClick={showNetworkError}>
            Network
          </Button>
        </Box>
      </Box>

      <Box display="flex" flexDirection="column" gap={1}>
        <Text size={1} color="default2" fontWeight="medium">
          OTHER
        </Text>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Button variant="secondary" size="small" onClick={showSessionExpiring}>
            Warning
          </Button>
          <Button variant="secondary" size="small" onClick={showExportStarted}>
            Info
          </Button>
        </Box>
      </Box>

      <Button variant="tertiary" size="small" onClick={() => toast.dismiss()}>
        Dismiss All
      </Button>
    </Box>
  );
};
