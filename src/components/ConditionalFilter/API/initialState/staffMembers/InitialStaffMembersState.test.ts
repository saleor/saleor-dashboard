import { UrlEntry, UrlToken } from "../../../ValueProvider/UrlToken";
import { InitialStaffMembersStateResponse } from "./InitialStaffMembersState";

describe("ConditionalFilter / API / Page / InitialStaffMembersState", () => {
  it("should filter by status", () => {
    // Arrange
    const initialStaffMembersState = InitialStaffMembersStateResponse.empty();

    initialStaffMembersState.staffMemberStatus = [
      {
        label: "Active",
        value: "active",
        slug: "active",
      },
      {
        label: "Inactive",
        value: "deactivated",
        slug: "deactivated",
      },
    ];

    const token = UrlToken.fromUrlEntry(new UrlEntry("s0.staffMemberStatus", "active"));
    const expectedOutput = [
      {
        label: "Active",
        value: "active",
        slug: "active",
      },
    ];

    // Act
    const result = initialStaffMembersState.filterByUrlToken(token);

    // Assert
    expect(result).toEqual(expectedOutput);
  });
});
