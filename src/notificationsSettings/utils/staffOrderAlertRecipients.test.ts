import {
  assignedStaffUserIds,
  mapStaffOrderAlertRecipient,
  mapStaffOrderAlertRecipients,
  recipientDisplayName,
  recipientWillReceiveOrderAlert,
  type StaffOrderAlertRecipient,
  toStaffNotificationRecipientGraphqlId,
} from "./staffOrderAlertRecipients";

const linkedActive: StaffOrderAlertRecipient = {
  id: "r1",
  email: "ada@example.com",
  active: true,
  userId: "u1",
  firstName: "Ada",
  lastName: "Lovelace",
  isStaffActive: true,
};

describe("staffOrderAlertRecipients", () => {
  it("maps a shop recipient node onto the card model", () => {
    // Arrange
    const node = {
      id: "r1",
      email: "ada@example.com",
      active: true,
      user: {
        id: "u1",
        email: "ada@example.com",
        firstName: "Ada",
        lastName: "Lovelace",
        isActive: true,
      },
    };

    // Act
    const recipient = mapStaffOrderAlertRecipient(node);

    // Assert
    expect(recipient).toEqual(linkedActive);
  });

  it("treats a missing user as an email-only recipient", () => {
    // Arrange
    const node = {
      id: "r2",
      email: "ops@example.com",
      active: true,
    };

    // Act
    const recipient = mapStaffOrderAlertRecipient(node);

    // Assert
    expect(recipient.userId).toBeNull();
    expect(recipient.isStaffActive).toBeNull();
    expect(recipient.email).toBe("ops@example.com");
  });

  it("skips null nodes when mapping a list", () => {
    // Arrange // Act
    const recipients = mapStaffOrderAlertRecipients([
      { id: "r1", email: "a@example.com", active: true },
      null,
    ]);

    // Assert
    expect(recipients).toHaveLength(1);
    expect(recipients[0].id).toBe("r1");
  });

  it("only treats linked active staff as sendable", () => {
    // Arrange // Act // Assert
    expect(recipientWillReceiveOrderAlert(linkedActive)).toBe(true);
    expect(recipientWillReceiveOrderAlert({ ...linkedActive, active: false })).toBe(false);
    expect(recipientWillReceiveOrderAlert({ ...linkedActive, isStaffActive: false })).toBe(false);
    expect(
      recipientWillReceiveOrderAlert({ ...linkedActive, userId: null, isStaffActive: null }),
    ).toBe(false);
  });

  it("collects assigned staff user ids", () => {
    // Arrange
    const recipients: StaffOrderAlertRecipient[] = [
      linkedActive,
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

    // Act
    const ids = assignedStaffUserIds(recipients);

    // Assert
    expect([...ids]).toEqual(["u1"]);
  });

  it("encodes a raw recipient pk as a Relay global id", () => {
    // Arrange // Act
    const encoded = toStaffNotificationRecipientGraphqlId("1");

    // Assert
    expect(atob(encoded)).toBe("StaffNotificationRecipient:1");
  });

  it("leaves an already-encoded recipient id unchanged", () => {
    // Arrange
    const encoded = btoa("StaffNotificationRecipient:1");

    // Act // Assert
    expect(toStaffNotificationRecipientGraphqlId(encoded)).toBe(encoded);
  });

  it("prefers the staff name and falls back to email", () => {
    // Arrange // Act // Assert
    expect(recipientDisplayName(linkedActive)).toBe("Ada Lovelace");
    expect(
      recipientDisplayName({
        ...linkedActive,
        firstName: null,
        lastName: null,
      }),
    ).toBe("ada@example.com");
  });
});
