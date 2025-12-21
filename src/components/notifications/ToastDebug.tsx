/**
 * Temporary debug component to preview toast variants
 * Remove this file after styling is finalized
 */
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { GripVertical } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Toast } from "./Toast";

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

  const showToast = (
    type: "success" | "error" | "warning" | "info",
    title: string,
    description?: string,
    action?: { label: string; onClick: () => void },
  ) => {
    toast.custom(
      id => <Toast id={id} type={type} title={title} description={description} action={action} />,
      {
        duration: type === "error" ? Infinity : 5000,
      },
    );
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
          <Button
            variant="secondary"
            size="small"
            onClick={() =>
              showToast(
                "success",
                "Saved changes",
                "Product details have been updated successfully.",
              )
            }
          >
            Saved changes
          </Button>
          <Button
            variant="secondary"
            size="small"
            onClick={() =>
              showToast(
                "success",
                "Order confirmed",
                "Order #12345 has been confirmed and is ready for fulfillment.",
              )
            }
          >
            Order confirmed
          </Button>
          <Button
            variant="secondary"
            size="small"
            onClick={() =>
              showToast("success", "Product deleted", "The product has been moved to trash.", {
                label: "Undo",
                onClick: () => showToast("success", "Restored", "Product has been restored."),
              })
            }
          >
            With Undo
          </Button>
        </Box>
      </Box>

      <Box display="flex" flexDirection="column" gap={1}>
        <Text size={1} color="default2" fontWeight="medium">
          ERRORS
        </Text>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Button
            variant="secondary"
            size="small"
            onClick={() =>
              showToast(
                "error",
                "Something went wrong",
                "Unable to save changes. Please try again.",
              )
            }
          >
            Simple
          </Button>
          <Button
            variant="secondary"
            size="small"
            onClick={() =>
              showToast(
                "error",
                "Permission denied",
                "You don't have permission to perform this action.",
              )
            }
          >
            Permission
          </Button>
          <Button
            variant="secondary"
            size="small"
            onClick={() =>
              showToast(
                "error",
                "Failed to update product",
                "Product with this SKU already exists.",
              )
            }
          >
            GraphQL
          </Button>
          <Button
            variant="secondary"
            size="small"
            onClick={() =>
              showToast(
                "error",
                "Network error",
                "Unable to connect to the server. Please try again later.",
              )
            }
          >
            Network
          </Button>
        </Box>
      </Box>

      <Box display="flex" flexDirection="column" gap={1}>
        <Text size={1} color="default2" fontWeight="medium">
          OTHER
        </Text>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Button
            variant="secondary"
            size="small"
            onClick={() =>
              showToast(
                "warning",
                "Session expiring soon",
                "Your session will expire in 5 minutes. Save your work.",
              )
            }
          >
            Warning
          </Button>
          <Button
            variant="secondary"
            size="small"
            onClick={() =>
              showToast(
                "info",
                "Export started",
                "Your export is being processed. You'll be notified when it's ready.",
              )
            }
          >
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
