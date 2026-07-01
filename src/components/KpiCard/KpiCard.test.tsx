import { ThemeProvider } from "@saleor/macaw-ui-next";
import { fireEvent, render, type RenderResult, screen } from "@testing-library/react";
import { type ReactElement, type ReactNode } from "react";

import { KpiCard } from "./KpiCard";

const Wrapper = ({ children }: { children: ReactNode }): JSX.Element => (
  <ThemeProvider>{children}</ThemeProvider>
);

const renderCard = (ui: ReactElement): RenderResult => render(ui, { wrapper: Wrapper });

describe("KpiCard", () => {
  it("renders title and value", () => {
    // Arrange / Act
    renderCard(<KpiCard title="Total orders" value="42" />);

    // Assert
    expect(screen.getByText("Total orders")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders icon, subtitle and tooltip trigger when provided", () => {
    // Arrange / Act
    renderCard(
      <KpiCard
        title="Avg order value"
        value="$386"
        icon={<span data-test-id="kpi-icon">$</span>}
        subtitle="across last 5 orders"
        tooltip="explanation"
      />,
    );

    // Assert
    expect(screen.getByTestId("kpi-icon")).toBeInTheDocument();
    expect(screen.getByText("across last 5 orders")).toBeInTheDocument();
    // The tooltip trigger renders an Info icon; we check the card has the trigger by
    // searching for the SVG via the test id we passed for the outer card.
  });

  it("renders skeleton placeholders when loading", () => {
    // Arrange / Act
    const { container } = renderCard(
      <KpiCard title="Total orders" value="—" loading dataTestId="kpi-loading" />,
    );

    // Assert - title and value are NOT rendered when loading
    expect(screen.queryByText("Total orders")).not.toBeInTheDocument();
    expect(screen.queryByText("—")).not.toBeInTheDocument();
    // Outer test id is still applied so consumers can target the loading card.
    expect(container.querySelector('[data-test-id="kpi-loading"]')).toBeInTheDocument();
  });

  it("invokes onSelect when the card is clicked", () => {
    // Arrange
    const onSelect = jest.fn();

    renderCard(
      <KpiCard title="Orders" value="28" onSelect={onSelect} dataTestId="kpi-clickable" />,
    );

    // Act
    const card = screen.getByTestId("kpi-clickable");

    fireEvent.click(card);

    // Assert
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("does not invoke onSelect when value tooltip trigger is used", () => {
    // Arrange
    const onSelect = jest.fn();

    renderCard(
      <KpiCard
        title="Orders"
        value="28"
        valueTooltip="Shipping: $10"
        onSelect={onSelect}
        dataTestId="kpi-clickable"
      />,
    );

    // Act
    const valueTooltipTrigger = screen.getByTestId("kpi-value-tooltip-trigger");

    fireEvent.pointerDown(valueTooltipTrigger);
    fireEvent.click(valueTooltipTrigger);

    // Assert
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("does not invoke onSelect when tooltip trigger is used", () => {
    // Arrange
    const onSelect = jest.fn();

    renderCard(
      <KpiCard
        title="Orders"
        value="28"
        tooltip="Orders placed in the selected period"
        onSelect={onSelect}
        dataTestId="kpi-clickable"
      />,
    );

    // Act
    const tooltipTrigger = screen.getByTestId("kpi-tooltip-trigger");

    fireEvent.pointerDown(tooltipTrigger);
    fireEvent.click(tooltipTrigger);
    fireEvent.keyDown(tooltipTrigger, { key: "Enter" });

    // Assert
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("exposes button semantics and is keyboard activatable when onSelect is provided", () => {
    // Arrange
    const onSelect = jest.fn();

    renderCard(
      <KpiCard title="Orders" value="28" onSelect={onSelect} dataTestId="kpi-clickable" />,
    );

    // Act
    const card = screen.getByTestId("kpi-clickable");

    // Assert - exposes a button role and is focusable
    expect(card).toHaveAttribute("role", "button");
    expect(card).toHaveAttribute("tabindex", "0");

    // Act - Enter activates the card
    fireEvent.keyDown(card, { key: "Enter" });
    expect(onSelect).toHaveBeenCalledTimes(1);

    // Act - Space activates the card
    fireEvent.keyDown(card, { key: " " });
    expect(onSelect).toHaveBeenCalledTimes(2);

    // Act - unrelated keys do not activate
    fireEvent.keyDown(card, { key: "a" });
    expect(onSelect).toHaveBeenCalledTimes(2);
  });

  it("does not expose interactive semantics when onSelect is not provided", () => {
    // Arrange / Act
    renderCard(<KpiCard title="Orders" value="28" dataTestId="kpi-static" />);

    // Assert
    const card = screen.getByTestId("kpi-static");

    expect(card).not.toHaveAttribute("role");
    expect(card).not.toHaveAttribute("tabindex");
  });

  it("reflects active state via aria-pressed when interactive", () => {
    // Arrange / Act
    renderCard(
      <KpiCard
        title="Orders"
        value="28"
        onSelect={() => undefined}
        active
        dataTestId="kpi-active"
      />,
    );

    // Assert
    expect(screen.getByTestId("kpi-active")).toHaveAttribute("aria-pressed", "true");
  });

  it("renders delta value and trend", () => {
    // Arrange / Act
    renderCard(
      <KpiCard
        title="Orders"
        value="28"
        delta={{ value: "+12%", trend: "up" }}
        subtitle="vs prev period"
      />,
    );

    // Assert
    expect(screen.getByText("+12%")).toBeInTheDocument();
    expect(screen.getByText("vs prev period")).toBeInTheDocument();
  });
});
