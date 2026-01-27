import Wrapper from "@test/wrapper";
import { fireEvent, render, screen } from "@testing-library/react";

import { ChannelSummary } from "../utils/types";
import { PublishedSection } from "./PublishedSection";

const createSummary = (overrides: Partial<ChannelSummary> = {}): ChannelSummary => ({
  id: "channel-1",
  name: "Default Channel",
  slug: "default-channel",
  currencyCode: "USD",
  isActive: true,
  isPublished: false,
  publishedAt: null,
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

describe("PublishedSection", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-01-15T12:00:00Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("Toggle state", () => {
    it("renders toggle ON when isPublished=true", () => {
      // Arrange
      const summary = createSummary({ isPublished: true });

      // Act
      render(
        <Wrapper>
          <PublishedSection summary={summary} />
        </Wrapper>,
      );

      // Assert
      const toggle = screen.getByRole("button", { pressed: true });

      expect(toggle).toBeInTheDocument();
    });

    it("renders toggle OFF when isPublished=false", () => {
      // Arrange
      const summary = createSummary({ isPublished: false });

      // Act
      render(
        <Wrapper>
          <PublishedSection summary={summary} />
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
      const summary = createSummary({ isPublished: true });

      // Act
      render(
        <Wrapper>
          <PublishedSection summary={summary} onChange={jest.fn()} />
        </Wrapper>,
      );

      // Assert
      expect(screen.getByText("Schedule for later")).toBeInTheDocument();
    });

    it("does NOT show schedule checkbox when toggle is OFF", () => {
      // Arrange
      const summary = createSummary({ isPublished: false });

      // Act
      render(
        <Wrapper>
          <PublishedSection summary={summary} onChange={jest.fn()} />
        </Wrapper>,
      );

      // Assert
      expect(screen.queryByText("Schedule for later")).not.toBeInTheDocument();
    });
  });

  describe("Initial state from originalSummary", () => {
    it("initializes showDatePicker=true when original was scheduled (future date)", () => {
      // Arrange
      const futureDate = "2025-02-01T12:00:00Z";
      const summary = createSummary({ isPublished: true, publishedAt: futureDate });
      const originalSummary = createSummary({ isPublished: true, publishedAt: futureDate });

      // Act
      render(
        <Wrapper>
          <PublishedSection
            summary={summary}
            originalSummary={originalSummary}
            onChange={jest.fn()}
          />
        </Wrapper>,
      );

      // Assert - date picker should be visible because showDatePicker was initialized as true
      expect(screen.getByRole("checkbox", { checked: true })).toBeInTheDocument();
      expect(screen.getByText(/Scheduled for/)).toBeInTheDocument();
    });

    it("initializes showDatePicker=false when original was visible (past date)", () => {
      // Arrange
      const pastDate = "2025-01-10T12:00:00Z";
      const summary = createSummary({ isPublished: true, publishedAt: pastDate });
      const originalSummary = createSummary({ isPublished: true, publishedAt: pastDate });

      // Act
      render(
        <Wrapper>
          <PublishedSection
            summary={summary}
            originalSummary={originalSummary}
            onChange={jest.fn()}
          />
        </Wrapper>,
      );

      // Assert - checkbox should be unchecked because showDatePicker was initialized as false
      expect(screen.getByRole("checkbox", { checked: false })).toBeInTheDocument();
      expect(screen.getByText(/since/)).toBeInTheDocument();
    });

    it("initializes showDatePicker=false when original had no publishedAt", () => {
      // Arrange
      const summary = createSummary({ isPublished: true, publishedAt: null });
      const originalSummary = createSummary({ isPublished: true, publishedAt: null });

      // Act
      render(
        <Wrapper>
          <PublishedSection
            summary={summary}
            originalSummary={originalSummary}
            onChange={jest.fn()}
          />
        </Wrapper>,
      );

      // Assert
      expect(screen.getByRole("checkbox", { checked: false })).toBeInTheDocument();
      expect(screen.getByText("Visible now")).toBeInTheDocument();
    });
  });

  describe("onChange callbacks", () => {
    it("calls onChange(true, null) when toggling ON", () => {
      // Arrange
      const summary = createSummary({ isPublished: false });
      const onChange = jest.fn();

      render(
        <Wrapper>
          <PublishedSection summary={summary} onChange={onChange} />
        </Wrapper>,
      );

      // Act
      const toggle = screen.getByRole("button", { pressed: false });

      fireEvent.click(toggle);

      // Assert
      expect(onChange).toHaveBeenCalledWith(true, null);
    });

    it("calls onChange(false, null) when toggling OFF", () => {
      // Arrange
      const summary = createSummary({ isPublished: true });
      const onChange = jest.fn();

      render(
        <Wrapper>
          <PublishedSection summary={summary} onChange={onChange} />
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
    it("shows 'hidden from public API' info when toggle is OFF", () => {
      // Arrange
      const summary = createSummary({ isPublished: false });

      // Act
      render(
        <Wrapper>
          <PublishedSection summary={summary} />
        </Wrapper>,
      );

      // Assert
      expect(screen.getByText("Hidden from public API.")).toBeInTheDocument();
    });

    it("shows warning when scheduling a currently-visible product", () => {
      // Arrange
      const futureDate = "2025-02-01T12:00:00Z";
      const pastDate = "2025-01-10T12:00:00Z";

      // Original was visible (past date)
      const originalSummary = createSummary({ isPublished: true, publishedAt: pastDate });
      // User set a future date
      const summary = createSummary({ isPublished: true, publishedAt: futureDate });

      // Act
      render(
        <Wrapper>
          <PublishedSection
            summary={summary}
            originalSummary={originalSummary}
            onChange={jest.fn()}
          />
        </Wrapper>,
      );

      // User needs to check the schedule checkbox to see the warning
      const checkbox = screen.getByRole("checkbox");

      fireEvent.click(checkbox);

      // Assert - warning should appear
      expect(screen.getByText(/Product will be hidden until/)).toBeInTheDocument();
    });
  });

  describe("Disabled state", () => {
    it("disables toggle when disabled=true", () => {
      // Arrange
      const summary = createSummary({ isPublished: true });

      // Act
      render(
        <Wrapper>
          <PublishedSection summary={summary} disabled onChange={jest.fn()} />
        </Wrapper>,
      );

      // Assert
      const toggle = screen.getByRole("button", { pressed: true });

      expect(toggle).toBeDisabled();
    });

    it("disables toggle when onChange is not provided", () => {
      // Arrange
      const summary = createSummary({ isPublished: true });

      // Act
      render(
        <Wrapper>
          <PublishedSection summary={summary} />
        </Wrapper>,
      );

      // Assert
      const toggle = screen.getByRole("button", { pressed: true });

      expect(toggle).toBeDisabled();
    });
  });

  describe("Past date warning", () => {
    it("shows info when scheduled date is in the past", () => {
      // Arrange
      const pastDate = "2025-01-10T12:00:00Z";
      const originalSummary = createSummary({
        isPublished: true,
        publishedAt: pastDate,
      });
      const summary = createSummary({
        isPublished: true,
        publishedAt: pastDate,
      });

      // Act
      render(
        <Wrapper>
          <PublishedSection
            summary={summary}
            originalSummary={originalSummary}
            onChange={jest.fn()}
          />
        </Wrapper>,
      );

      // Check the schedule checkbox
      const checkbox = screen.getByRole("checkbox");

      fireEvent.click(checkbox);

      // Assert
      expect(
        screen.getByText(/This date is in the past. The product will be visible immediately/),
      ).toBeInTheDocument();
    });
  });
});
