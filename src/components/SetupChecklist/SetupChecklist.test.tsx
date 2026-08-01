import { Button } from "@saleor/macaw-ui-next";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SetupChecklist } from "./SetupChecklist";
import { type SetupChecklistTask } from "./types";

const tasks: SetupChecklistTask[] = [
  {
    id: "one",
    title: "First step",
    description: "Do the first thing",
    status: "active",
    details: "Longer explanation for merchants.",
    action: <Button data-test-id="first-cta">Start</Button>,
  },
  {
    id: "two",
    title: "Second step",
    description: "Blocked until first is done",
    status: "locked",
    requirement: "Requires first step",
    details: "Why this step is locked.",
    // Locked steps explain the dependency via the requirement pill — no disabled CTA.
  },
  {
    id: "three",
    title: "Optional step",
    description: "Guidance only",
    status: "pending",
    action: <Button data-test-id="third-cta">Open</Button>,
  },
];

describe("SetupChecklist", () => {
  it("keeps actions visible when details are folded and shows them for the active step", async () => {
    // Arrange
    render(
      <SetupChecklist
        title="Finish setup"
        subtitle="Complete the required steps"
        progress={{ done: 0, total: 2 }}
        tasks={tasks}
        nextUp="Next up: First step"
        footerActions={<Button data-test-id="skip">Skip for now</Button>}
      />,
      { wrapper: Wrapper },
    );

    // Assert — CTA stays in the row even after collapsing details
    expect(screen.getByTestId("first-cta")).toBeInTheDocument();
    expect(screen.queryByTestId("second-cta")).not.toBeInTheDocument();
    expect(screen.getByTestId("third-cta")).toBeInTheDocument();
    expect(screen.getByTestId("setup-checklist-task-one")).toHaveAttribute("data-expanded", "true");

    // Act
    await userEvent.click(screen.getByTestId("setup-checklist-task-expand-one"));

    // Assert
    expect(screen.getByTestId("setup-checklist-task-one")).toHaveAttribute(
      "data-expanded",
      "false",
    );
    expect(screen.getByTestId("first-cta")).toBeInTheDocument();
    expect(screen.queryByText("Longer explanation for merchants.")).not.toBeInTheDocument();
    expect(screen.queryByTestId("setup-checklist-task-expand-three")).not.toBeInTheDocument();
  });

  it("expands a locked step for extra explanation without a disabled CTA", async () => {
    // Arrange
    render(<SetupChecklist title="Finish setup" progress={{ done: 0, total: 2 }} tasks={tasks} />, {
      wrapper: Wrapper,
    });

    // Act
    await userEvent.click(screen.getByTestId("setup-checklist-task-expand-two"));

    // Assert
    expect(screen.getByTestId("setup-checklist-task-two")).toHaveAttribute("data-expanded", "true");
    expect(screen.getByText("Why this step is locked.")).toBeInTheDocument();
    expect(screen.getByText("Requires first step")).toBeInTheDocument();
    expect(screen.queryByTestId("second-cta")).not.toBeInTheDocument();
  });
});
