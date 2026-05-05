import { getHeaderIssueBadgeProps } from "./issueBadge";
import { type AvailabilityIssue } from "./types";

const issue = (overrides: Partial<AvailabilityIssue> = {}): AvailabilityIssue => ({
  id: "no-stock",
  severity: "warning",
  channelId: "channel-1",
  channelName: "Default Channel",
  message: "msg",
  description: "desc",
  ...overrides,
});

describe("getHeaderIssueBadgeProps", () => {
  it("returns null when there are no issues at all", () => {
    expect(getHeaderIssueBadgeProps([])).toBeNull();
  });

  it("returns null when issues are info-only (info is advisory, not header-worthy)", () => {
    expect(
      getHeaderIssueBadgeProps([
        issue({ id: "no-shipping-zones", severity: "info" }),
        issue({ id: "stock-outside-channel-warehouses", severity: "info" }),
      ]),
    ).toBeNull();
  });

  it("counts a single warning and reports type=warning", () => {
    expect(getHeaderIssueBadgeProps([issue({ severity: "warning" })])).toEqual({
      count: 1,
      type: "warning",
    });
  });

  it("counts a single error and reports type=error", () => {
    expect(getHeaderIssueBadgeProps([issue({ severity: "error" })])).toEqual({
      count: 1,
      type: "error",
    });
  });

  it("ignores info issues when summing the count alongside header issues", () => {
    expect(
      getHeaderIssueBadgeProps([
        issue({ id: "no-stock", severity: "warning" }),
        issue({ id: "no-shipping-zones", severity: "info" }),
        issue({ id: "stock-outside-channel-warehouses", severity: "info" }),
      ]),
    ).toEqual({ count: 1, type: "warning" });
  });

  it("escalates type to error when at least one header issue is an error", () => {
    expect(
      getHeaderIssueBadgeProps([
        issue({ id: "no-variants", severity: "error" }),
        issue({ id: "no-stock", severity: "warning" }),
        issue({ id: "no-shipping-zones", severity: "info" }),
      ]),
    ).toEqual({ count: 2, type: "error" });
  });

  it("counts only header-worthy issues, even when several errors and warnings co-exist", () => {
    expect(
      getHeaderIssueBadgeProps([
        issue({ severity: "error" }),
        issue({ severity: "error" }),
        issue({ severity: "warning" }),
        issue({ severity: "info" }),
      ]),
    ).toEqual({ count: 3, type: "error" });
  });
});
