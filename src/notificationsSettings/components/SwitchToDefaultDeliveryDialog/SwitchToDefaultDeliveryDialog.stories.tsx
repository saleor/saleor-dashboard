import { useState } from "react";

import { SwitchToDefaultDeliveryDialog } from "./SwitchToDefaultDeliveryDialog";

const meta = {
  title: "Notifications / SwitchToDefaultDeliveryDialog",
  component: SwitchToDefaultDeliveryDialog,
};

export default meta;

export const Default = (): JSX.Element => {
  const [open, setOpen] = useState(true);

  return (
    <SwitchToDefaultDeliveryDialog
      open={open}
      confirmButtonState="default"
      resetNotificationCopy
      onClose={() => setOpen(false)}
      onConfirm={() => setOpen(false)}
      onDownloadBackup={() => undefined}
    />
  );
};
