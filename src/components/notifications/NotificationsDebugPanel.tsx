/**
 * Debug panel for previewing toast notifications
 * Accessible via DevTools (Cmd+Shift+D)
 */
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { toast } from "sonner";

import { Toast } from "./Toast";

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

export const NotificationsDebugPanel = () => {
  return (
    <Box padding={3} display="flex" flexDirection="column" gap={3}>
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
            Saved
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
              showToast("warning", "Session expiring", "Your session will expire in 5 minutes.")
            }
          >
            Warning
          </Button>
          <Button
            variant="secondary"
            size="small"
            onClick={() =>
              showToast("info", "Export started", "You'll be notified when it's ready.")
            }
          >
            Info
          </Button>
        </Box>
      </Box>

      <Box display="flex" flexDirection="column" gap={1}>
        <Text size={1} color="default2" fontWeight="medium">
          LENGTH TEST
        </Text>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Button
            variant="secondary"
            size="small"
            onClick={() => showToast("info", "Short", "One line.")}
          >
            Short
          </Button>
          <Button
            variant="secondary"
            size="small"
            onClick={() =>
              showToast(
                "error",
                "Long message",
                "This is a much longer error message that spans multiple lines to test how the toast handles longer content. It should wrap properly.",
              )
            }
          >
            Long
          </Button>
        </Box>
      </Box>

      <Button variant="tertiary" size="small" onClick={() => toast.dismiss()}>
        Dismiss All
      </Button>
    </Box>
  );
};
