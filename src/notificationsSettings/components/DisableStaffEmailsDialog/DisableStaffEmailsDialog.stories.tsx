import { useState } from "react";

import { DisableStaffEmailsDialog } from "./DisableStaffEmailsDialog";

const meta = {
  title: "Notifications / DisableStaffEmailsDialog",
  component: DisableStaffEmailsDialog,
};

export default meta;

export const Default = (): JSX.Element => {
  const [open, setOpen] = useState(true);

  return (
    <DisableStaffEmailsDialog
      open={open}
      confirmButtonState="default"
      onClose={() => setOpen(false)}
      onConfirm={() => setOpen(false)}
    />
  );
};
