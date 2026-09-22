import { ThemeProvider } from "@saleor/macaw-ui-next";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { type StaffOrderAlertRecipient } from "../../utils/staffOrderAlertRecipients";
import { StaffOrderAlertRecipientsCard } from "./StaffOrderAlertRecipientsCard";

jest.mock("@dashboard/ripples/components/Ripple", () => ({
  Ripple: () => null,
}));

jest.mock("react-intl", () => ({
  FormattedMessage: ({ defaultMessage }: { defaultMessage: string }) => <>{defaultMessage}</>,
  useIntl: () => ({
    formatMessage: ({ defaultMessage }: { defaultMessage: string }) => defaultMessage,
  }),
  defineMessages: (messages: unknown) => messages,
}));

const linkedRecipient: StaffOrderAlertRecipient = {
  id: "r1",
  email: "ada@example.com",
  active: true,
  userId: "u1",
  firstName: "Ada",
  lastName: "Lovelace",
  isStaffActive: true,
};

const emailOnlyRecipient: StaffOrderAlertRecipient = {
  id: "r2",
  email: "ops@example.com",
  active: true,
  userId: null,
  firstName: null,
  lastName: null,
  isStaffActive: null,
};

const renderCard = (props: Partial<Parameters<typeof StaffOrderAlertRecipientsCard>[0]> = {}) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <ThemeProvider>
      <MemoryRouter>{children}</MemoryRouter>
    </ThemeProvider>
  );

  return render(
    <StaffOrderAlertRecipientsCard
      recipients={[]}
      loading={false}
      disabled={false}
      canManageStaff={true}
      staffEmailsEnabled={true}
      onAssign={jest.fn()}
      onRemove={jest.fn()}
      {...props}
    />,
    { wrapper },
  );
};

describe("StaffOrderAlertRecipientsCard", () => {
  it("shows an empty state and an assign action", () => {
    // Arrange
    const onAssign = jest.fn();

    renderCard({ onAssign });

    // Assert
    expect(screen.getByText(/No one is subscribed/)).toBeInTheDocument();
    expect(screen.getByTestId("settings-section-header-end")).toContainElement(
      screen.getByTestId("assign-order-alert-recipients"),
    );
  });

  it("lists recipients and removes one", async () => {
    // Arrange
    const onRemove = jest.fn();

    renderCard({ recipients: [linkedRecipient], onRemove });

    // Act
    await userEvent.click(
      screen.getByTestId("remove-order-alert-recipient-r1").querySelector("button") as HTMLElement,
    );

    // Assert
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(onRemove).toHaveBeenCalledWith("r1");
    expect(screen.getByTestId("settings-section-header-end")).toContainElement(
      screen.getByTestId("assign-order-alert-recipients"),
    );
  });

  it("explains why a muted recipient will not be emailed", () => {
    // Arrange
    const mutedRecipient: StaffOrderAlertRecipient = {
      ...linkedRecipient,
      id: "r3",
      active: false,
    };

    renderCard({ recipients: [mutedRecipient] });

    // Assert
    expect(
      screen.getByText("This recipient is muted, so they will not receive new-order emails."),
    ).toBeInTheDocument();
  });

  it("explains why an email-only recipient will not be emailed", () => {
    // Arrange
    renderCard({ recipients: [emailOnlyRecipient] });

    // Assert
    expect(screen.getByText("ops@example.com")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Not linked to an active staff member, so Saleor will not send new-order emails to this address.",
      ),
    ).toBeInTheDocument();
  });

  it("warns when staff emails are turned off", () => {
    // Arrange
    renderCard({ staffEmailsEnabled: false, recipients: [linkedRecipient] });

    // Assert
    expect(screen.getByTestId("staff-order-alerts-emails-disabled")).toBeInTheDocument();
  });

  it("hides assign when the user cannot manage staff", () => {
    // Arrange
    renderCard({ canManageStaff: false });

    // Assert
    expect(screen.queryByTestId("assign-order-alert-recipients")).not.toBeInTheDocument();
    expect(screen.getByText(/You need permission to manage staff/)).toBeInTheDocument();
  });
});
