import { transactionEvent } from "@dashboard/orders/fixtures";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import { EventItem } from "./EventItem";

jest.mock("@dashboard/featureFlags", () => ({
  useFlag: jest.fn(() => ({ enabled: true })),
}));

describe("EventItem", () => {
  it("displays correct event data", () => {
    // Arrange
    const onHover = jest.fn();

    // Act
    render(
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <Wrapper>
          <EventItem event={transactionEvent} onHover={onHover} hoveredPspReference={"PSP"} />
        </Wrapper>
      </MemoryRouter>,
    );

    // Assert
    const row = screen.getByRole("row");

    expect(row).toHaveTextContent("Success"); // Transaction event status
    expect(row).toHaveTextContent("Capture"); // Transaction event type
    expect(row).toHaveTextContent(transactionEvent.amount.amount.toString());
    expect(row).toHaveTextContent(transactionEvent.amount.currency);
    expect(row).toHaveTextContent(transactionEvent.pspReference);
    expect(row).toHaveTextContent("Aug 12, 2022, 02:40 PM"); // date from transactionEvent
    expect(onHover).not.toHaveBeenCalled();
  });

  it("displays avatar with title for app creator", () => {
    // Arrange & Act
    render(
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <Wrapper>
          <EventItem
            event={transactionEvent}
            onHover={() => undefined}
            hoveredPspReference={"PSP"}
          />
        </Wrapper>
      </MemoryRouter>,
    );

    // Assert - app name should be in title attribute, not visible text
    const avatarWithTitle = screen.getByTitle(transactionEvent.createdBy.name as string);

    expect(avatarWithTitle).toBeInTheDocument();
  });

  it("calls onHover function when hovered", async () => {
    // Arrange
    const onHover = jest.fn();

    render(
      <Wrapper>
        <EventItem event={transactionEvent} onHover={onHover} hoveredPspReference={"PSP"} />
      </Wrapper>,
    );

    // Act
    const row = screen.getByRole("row");

    await userEvent.hover(row);

    // Assert
    expect(onHover).toHaveBeenCalledWith(transactionEvent.pspReference);
  });

  it("applies hover styles if passed pspReference matches event's pspReference", () => {
    // Arrange & Act
    render(
      <Wrapper>
        <EventItem
          event={transactionEvent}
          onHover={() => undefined}
          hoveredPspReference={transactionEvent.pspReference}
        />
      </Wrapper>,
    );

    // Assert
    const row = screen.getByRole("row");

    expect(row).toHaveAttribute("data-ishovered", "true");
  });
});
