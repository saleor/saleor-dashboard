import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type Survey, SurveyQuestionType, SurveyType } from "posthog-js";
import { IntlProvider } from "react-intl";

import { FeedbackPopover } from "./FeedbackPopover";
import { feedbackContactEmailProperty } from "./feedbackResponse";

const mockCapture = jest.fn();
const mockNotify = jest.fn();

jest.mock("posthog-js/react", () => ({ usePostHog: () => ({ capture: mockCapture }) }));
jest.mock("@dashboard/hooks/useNotifier/useNotifier", () => ({ useNotifier: () => mockNotify }));
jest.mock("@dashboard/auth/useUser", () => ({
  useUser: (): { user: { email: string } } => ({ user: { email: "staff@example.com" } }),
}));

// Radix primitives used by macaw-ui need ResizeObserver, which jsdom lacks.
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

const survey: Survey = {
  id: "feedback",
  name: "Dashboard feedback",
  description: "",
  type: SurveyType.API,
  appearance: null,
  conditions: null,
  questions: [
    { id: "feedback-question", type: SurveyQuestionType.Open, question: "What could we improve?" },
  ],
  start_date: "2026-09-01",
  end_date: null,
  feature_flag_keys: null,
  linked_flag_key: null,
  targeting_flag_key: null,
  internal_targeting_flag_key: null,
  current_iteration: null,
  current_iteration_start_date: null,
};

const renderPopover = (): void => {
  render(
    <IntlProvider locale="en">
      <FeedbackPopover survey={survey} side="top">
        <button type="button">Send feedback</button>
      </FeedbackPopover>
    </IntlProvider>,
  );
};

const sentProperties = (): Record<string, unknown> =>
  mockCapture.mock.calls.find(([event]) => event === "survey sent")?.[1];

beforeEach(() => {
  jest.clearAllMocks();
});

describe("FeedbackPopover", () => {
  it("shows the feedback box and an unticked contact checkbox in one step", async () => {
    // Arrange
    renderPopover();

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Send feedback" }));

    // Assert
    expect(screen.getByRole("textbox", { name: "What could we improve?" })).toBeVisible();
    expect(
      screen.getByRole("checkbox", { name: "Can we contact you about this by email?" }),
    ).not.toBeChecked();
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
    expect(mockCapture).toHaveBeenCalledWith("survey shown", expect.anything());
  });

  it("sends the email with the feedback when contact is ticked", async () => {
    // Arrange
    renderPopover();
    await userEvent.click(screen.getByRole("button", { name: "Send feedback" }));
    await userEvent.type(screen.getByRole("textbox"), "Faster lists");
    await userEvent.click(screen.getByRole("checkbox"));

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Send" }));

    // Assert
    expect(sentProperties()).toMatchObject({
      $survey_id: "feedback",
      "$survey_response_feedback-question": "Faster lists",
      [feedbackContactEmailProperty]: "staff@example.com",
    });
    expect(mockNotify).toHaveBeenCalledWith(expect.objectContaining({ status: "success" }));
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("sends feedback without the email when contact is not ticked", async () => {
    // Arrange
    renderPopover();
    await userEvent.click(screen.getByRole("button", { name: "Send feedback" }));
    await userEvent.type(screen.getByRole("textbox"), "Faster lists");

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Send" }));

    // Assert
    expect(sentProperties()).toHaveProperty("$survey_response_feedback-question", "Faster lists");
    expect(sentProperties()).not.toHaveProperty(feedbackContactEmailProperty);
  });

  it("records a dismissal without sending feedback when closed", async () => {
    // Arrange
    renderPopover();
    await userEvent.click(screen.getByRole("button", { name: "Send feedback" }));
    await userEvent.type(screen.getByRole("textbox"), "Draft");

    // Act
    await userEvent.keyboard("{Escape}");

    // Assert
    expect(mockCapture).toHaveBeenCalledWith("survey dismissed", expect.anything());
    expect(sentProperties()).toBeUndefined();
  });
});
