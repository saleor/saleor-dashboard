import { type StaffOrderAlertRecipient } from "@dashboard/notificationsSettings/utils/staffOrderAlertRecipients";
import { Box } from "@saleor/macaw-ui-next";
import { useState } from "react";

import { StaffOrderAlertRecipientsCard } from "./StaffOrderAlertRecipientsCard";

const meta = {
  title: "Notifications / StaffOrderAlertRecipientsCard",
  component: StaffOrderAlertRecipientsCard,
};

export default meta;

const initialRecipients: StaffOrderAlertRecipient[] = [
  {
    id: "r1",
    email: "ada@example.com",
    active: true,
    userId: "u1",
    firstName: "Ada",
    lastName: "Lovelace",
    isStaffActive: true,
  },
  {
    id: "r2",
    email: "ops@example.com",
    active: true,
    userId: null,
    firstName: null,
    lastName: null,
    isStaffActive: null,
  },
];

export const WithRecipients = (): React.ReactNode => {
  const [recipients, setRecipients] = useState(initialRecipients);

  return (
    <Box padding={6} __maxWidth="48rem">
      <StaffOrderAlertRecipientsCard
        recipients={recipients}
        loading={false}
        disabled={false}
        canManageStaff={true}
        staffEmailsEnabled={true}
        onAssign={() => undefined}
        onRemove={id => setRecipients(current => current.filter(recipient => recipient.id !== id))}
      />
    </Box>
  );
};

export const Empty = (): React.ReactNode => (
  <Box padding={6} __maxWidth="48rem">
    <StaffOrderAlertRecipientsCard
      recipients={[]}
      loading={false}
      disabled={false}
      canManageStaff={true}
      staffEmailsEnabled={true}
      onAssign={() => undefined}
      onRemove={() => undefined}
    />
  </Box>
);
