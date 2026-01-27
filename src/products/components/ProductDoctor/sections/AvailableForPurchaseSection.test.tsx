import Wrapper from "@test/wrapper";
import { fireEvent, render, screen } from "@testing-library/react";

import { ChannelSummary } from "../utils/types";
import { AvailableForPurchaseSection } from "./AvailableForPurchaseSection";

const createSummary = (overrides: Partial<ChannelSummary> = {}): ChannelSummary => ({
  id: "channel-1",
  name: "Default Channel",
  slug: "default-channel",
  currencyCode: "USD",
  isActive: true,
  isPublished: true,
  publishedAt: "2025-01-10T12:00:00Z",
  isAvailableForPurchase: false,
  availableForPurchaseAt: null,
  visibleInListings: true,
  warehouseCount: 1,
  warehouseNames: ["Warehouse 1"],
  shippingZoneCount: 1,
  shippingZoneNames: ["Zone 1"],
  countryCount: 1,
  ...overrides,
});

describe("AvailableForPurchaseSection", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-01-15T12:00:00Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("Toggle state - CRITICAL: uses date, NOT isAvailableForPurchase boolean", () => {
    it("toggle is ON when availableForPurchaseAt is set (past date)", () => {
      // Arrange - isAvailableForPurchase is true (computed from past date)
      const pastDate = "2025-01-10T12:00:00Z";
      const summary = createSummary({
        isAvailableForPurchase: true,
        availableForPurchaseAt: pastDate,
      });

      // Act
      render(
        <Wrapper>
          <AvailableForPurchaseSection summary={summary} />
        </Wrapper>,
      );

      // Assert - toggle should be ON because date exists
      const toggle = screen.getByRole("button", { pressed: true });

      expect(toggle).toBeInTheDocument();
    });

    it("toggle is ON when availableForPurchaseAt is set (future date) - even though isAvailableForPurchase is false", () => {
      // Arrange - THIS IS THE CRITICAL CASE!
      // isAvailableForPurchase is FALSE (computed because date is in future)
      // But toggle should be ON because availableForPurchaseAt is set
      const futureDate = "2025-02-01T12:00:00Z";
      const summary = createSummary({
        isAvailableForPurchase: false, // Computed as false because date is in future
        availableForPurchaseAt: futureDate,
      });

      // Act
      render(
        <Wrapper>
          <AvailableForPurchaseSection summary={summary} />
        </Wrapper>,
      );

      // Assert - toggle should STILL be ON because we check the DATE, not the boolean
      const toggle = screen.getByRole("button", { pressed: true });

      expect(toggle).toBeInTheDocument();
    });

    it("toggle is OFF when availableForPurchaseAt is null", () => {
      // Arrange
      const summary = createSummary({
        isAvailableForPurchase: false,
        availableForPurchaseAt: null,
      });

      // Act
      render(
        <Wrapper>
          <AvailableForPurchaseSection summary={summary} />
        </Wrapper>,
      );

      // Assert
      const toggle = screen.getByRole("button", { pressed: false });

      expect(toggle).toBeInTheDocument();
    });
  });

  describe("Scheduling checkbox", () => {
    it("shows 'Schedule for later' checkbox when toggle is ON", () => {
      // Arrange
      const summary = createSummary({
        availableForPurchaseAt: "2025-01-10T12:00:00Z",
      });

      // Act
      render(
        <Wrapper>
          <AvailableForPurchaseSection summary={summary} onChange={jest.fn()} />
        </Wrapper>,
      );

      // Assert
      expect(screen.getByText("Schedule for later")).toBeInTheDocument();
    });

    it("does NOT show schedule checkbox when toggle is OFF", () => {
      // Arrange
      const summary = createSummary({ availableForPurchaseAt: null });

      // Act
      render(
        <Wrapper>
          <AvailableForPurchaseSection summary={summary} onChange={jest.fn()} />
        </Wrapper>,
      );

      // Assert
      expect(screen.queryByText("Schedule for later")).not.toBeInTheDocument();
    });
  });

  describe("Initial state from originalSummary", () => {
    it("initializes isScheduleMode=true when original had future date", () => {
      // Arrange
      const futureDate = "2025-02-01T12:00:00Z";
      const summary = createSummary({ availableForPurchaseAt: futureDate });
      const originalSummary = createSummary({ availableForPurchaseAt: futureDate });

      // Act
      render(
        <Wrapper>
          <AvailableForPurchaseSection
            summary={summary}
            originalSummary={originalSummary}
            onChange={jest.fn()}
          />
        </Wrapper>,
      );

      // Assert - checkbox should be checked because isScheduleMode was initialized as true
      expect(screen.getByRole("checkbox", { checked: true })).toBeInTheDocument();
      expect(screen.getByText(/Scheduled for/)).toBeInTheDocument();
    });

    it("initializes isScheduleMode=false when original had past date", () => {
      // Arrange
      const pastDate = "2025-01-10T12:00:00Z";
      const summary = createSummary({ availableForPurchaseAt: pastDate });
      const originalSummary = createSummary({ availableForPurchaseAt: pastDate });

      // Act
      render(
        <Wrapper>
          <AvailableForPurchaseSection
            summary={summary}
            originalSummary={originalSummary}
            onChange={jest.fn()}
          />
        </Wrapper>,
      );

      // Assert - checkbox should be unchecked because isScheduleMode was initialized as false
      expect(screen.getByRole("checkbox", { checked: false })).toBeInTheDocument();
      expect(screen.getByText(/since/)).toBeInTheDocument();
    });

    it("initializes isScheduleMode=false when original had no date", () => {
      // Arrange - product becomes available for first time
      const summary = createSummary({ availableForPurchaseAt: "2025-01-15T12:00:00Z" });
      const originalSummary = createSummary({ availableForPurchaseAt: null });

      // Act
      render(
        <Wrapper>
          <AvailableForPurchaseSection
            summary={summary}
            originalSummary={originalSummary}
            onChange={jest.fn()}
          />
        </Wrapper>,
      );

      // Assert
      expect(screen.getByRole("checkbox", { checked: false })).toBeInTheDocument();
    });
  });

  describe("onChange callbacks", () => {
    it("calls onChange(true, <now>) when toggling ON - uses client-side timestamp", () => {
      // Arrange
      const summary = createSummary({ availableForPurchaseAt: null });
      const onChange = jest.fn();

      render(
        <Wrapper>
          <AvailableForPurchaseSection summary={summary} onChange={onChange} />
        </Wrapper>,
      );

      // Act
      const toggle = screen.getByRole("button", { pressed: false });

      fireEvent.click(toggle);

      // Assert - CRITICAL: must use client-side timestamp, not null
      // This is documented in saleor-publication-logic.mdc
      expect(onChange).toHaveBeenCalledWith(true, expect.any(String));

      const calledDate = onChange.mock.calls[0][1];

      expect(new Date(calledDate).getTime()).toBeCloseTo(
        new Date("2025-01-15T12:00:00Z").getTime(),
        -2,
      );
    });

    it("calls onChange(false, null) when toggling OFF", () => {
      // Arrange
      const summary = createSummary({ availableForPurchaseAt: "2025-01-10T12:00:00Z" });
      const onChange = jest.fn();

      render(
        <Wrapper>
          <AvailableForPurchaseSection summary={summary} onChange={onChange} />
        </Wrapper>,
      );

      // Act
      const toggle = screen.getByRole("button", { pressed: true });

      fireEvent.click(toggle);

      // Assert
      expect(onChange).toHaveBeenCalledWith(false, null);
    });
  });

  describe("Info callouts", () => {
    it("shows 'not purchasable' info when toggle is OFF", () => {
      // Arrange
      const summary = createSummary({ availableForPurchaseAt: null });

      // Act
      render(
        <Wrapper>
          <AvailableForPurchaseSection summary={summary} />
        </Wrapper>,
      );

      // Assert
      expect(screen.getByText("Visible but not purchasable.")).toBeInTheDocument();
      expect(
        screen.getByText("Customers can view this product but cannot add it to cart."),
      ).toBeInTheDocument();
    });

    it("shows warning when scheduling a currently-available product", () => {
      // Arrange
      const futureDate = "2025-02-01T12:00:00Z";
      const pastDate = "2025-01-10T12:00:00Z";

      // Original was available (past date)
      const originalSummary = createSummary({
        isAvailableForPurchase: true,
        availableForPurchaseAt: pastDate,
      });
      // User set a future date
      const summary = createSummary({
        isAvailableForPurchase: false, // Computed
        availableForPurchaseAt: futureDate,
      });

      // Act
      render(
        <Wrapper>
          <AvailableForPurchaseSection
            summary={summary}
            originalSummary={originalSummary}
            onChange={jest.fn()}
          />
        </Wrapper>,
      );

      // User checks the schedule checkbox
      const checkbox = screen.getByRole("checkbox");

      fireEvent.click(checkbox);

      // Assert
      expect(
        screen.getByText("Product will not be purchasable until this date."),
      ).toBeInTheDocument();
    });
  });

  describe("Disabled state", () => {
    it("disables toggle when disabled=true", () => {
      // Arrange
      const summary = createSummary({ availableForPurchaseAt: "2025-01-10T12:00:00Z" });

      // Act
      render(
        <Wrapper>
          <AvailableForPurchaseSection summary={summary} disabled onChange={jest.fn()} />
        </Wrapper>,
      );

      // Assert
      const toggle = screen.getByRole("button", { pressed: true });

      expect(toggle).toBeDisabled();
    });

    it("disables toggle when onChange is not provided", () => {
      // Arrange
      const summary = createSummary({ availableForPurchaseAt: "2025-01-10T12:00:00Z" });

      // Act
      render(
        <Wrapper>
          <AvailableForPurchaseSection summary={summary} />
        </Wrapper>,
      );

      // Assert
      const toggle = screen.getByRole("button", { pressed: true });

      expect(toggle).toBeDisabled();
    });
  });

  describe("Status display", () => {
    it("shows 'since <date>' when available with past date and not in schedule mode", () => {
      // Arrange
      const pastDate = "2025-01-10T12:00:00Z";
      const summary = createSummary({
        isAvailableForPurchase: true,
        availableForPurchaseAt: pastDate,
      });
      const originalSummary = createSummary({
        isAvailableForPurchase: true,
        availableForPurchaseAt: pastDate,
      });

      // Act
      render(
        <Wrapper>
          <AvailableForPurchaseSection
            summary={summary}
            originalSummary={originalSummary}
            onChange={jest.fn()}
          />
        </Wrapper>,
      );

      // Assert
      expect(screen.getByText(/since/)).toBeInTheDocument();
    });

    it("shows 'Scheduled for <date>' when in schedule mode with future date", () => {
      // Arrange
      const futureDate = "2025-02-01T12:00:00Z";
      const summary = createSummary({
        isAvailableForPurchase: false,
        availableForPurchaseAt: futureDate,
      });
      const originalSummary = createSummary({
        isAvailableForPurchase: false,
        availableForPurchaseAt: futureDate,
      });

      // Act
      render(
        <Wrapper>
          <AvailableForPurchaseSection
            summary={summary}
            originalSummary={originalSummary}
            onChange={jest.fn()}
          />
        </Wrapper>,
      );

      // Assert
      expect(screen.getByText(/Scheduled for/)).toBeInTheDocument();
    });
  });
});
