import { DashboardModal } from "@dashboard/components/Modal";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type Survey, SurveyQuestionType, SurveyType } from "posthog-js";
import { type ReactNode, useState } from "react";
import { IntlProvider } from "react-intl";

import { FeedbackPopover } from "./FeedbackPopover";
import { feedbackContactEmailProperty } from "./feedbackResponse";
import {
  type FeedbackSurveyContextValue,
  FeedbackSurveyProvider,
  useFeedbackSurvey,
} from "./FeedbackSurveyProvider";

const mockCapture = jest.fn();
const mockNotify = jest.fn();
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
const mockAvailability: { isAvailable: boolean; survey: Survey | undefined } = {
  isAvailable: true,
  survey,
};

jest.mock("posthog-js/react", () => ({ usePostHog: (): unknown => ({ capture: mockCapture }) }));
jest.mock("@dashboard/hooks/useNotifier/useNotifier", () => ({
  useNotifier: (): jest.Mock => mockNotify,
}));
jest.mock("@dashboard/auth/useUser", () => ({
  useUser: (): { user: { email: string } } => ({ user: { email: "staff@example.com" } }),
}));
jest.mock("./useFeedbackSurveyAvailability", () => ({
  useFeedbackSurveyAvailability: (): typeof mockAvailability => mockAvailability,
}));

// Radix primitives used by macaw-ui need ResizeObserver, which jsdom lacks.
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

let feedback: FeedbackSurveyContextValue;

const ContextHandle = (): null => {
  feedback = useFeedbackSurvey();

  return null;
};

const renderFeedback = (children?: ReactNode): void => {
  render(
    <IntlProvider locale="en">
      <FeedbackSurveyProvider>
        <ContextHandle />
        <FeedbackPopover side="top">
          <button type="button">Send feedback</button>
        </FeedbackPopover>
        {children}
      </FeedbackSurveyProvider>
    </IntlProvider>,
  );
};

const eventProperties = (name: string): Record<string, unknown> | undefined =>
  mockCapture.mock.calls.find(([event]) => event === name)?.[1];

const writeAndSend = async (): Promise<void> => {
  await userEvent.type(screen.getByRole("textbox"), "Faster lists");
  await userEvent.click(screen.getByRole("button", { name: "Send" }));
};

beforeEach(() => {
  jest.clearAllMocks();
  mockAvailability.isAvailable = true;
  mockAvailability.survey = survey;
});

describe("Feedback from the sidebar", () => {
  it("shows the feedback box and an unticked contact checkbox in one step", async () => {
    // Arrange
    renderFeedback();

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Send feedback" }));

    // Assert
    expect(screen.getByRole("textbox", { name: "What could we improve?" })).toHaveFocus();
    expect(
      screen.getByRole("checkbox", { name: "Can we contact you about this by email?" }),
    ).not.toBeChecked();
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
    expect(eventProperties("survey shown")).toMatchObject({
      $survey_id: "feedback",
      feedback_source: "sidebar",
    });
  });

  it("sends the email with the feedback when contact is ticked", async () => {
    // Arrange
    renderFeedback();
    await userEvent.click(screen.getByRole("button", { name: "Send feedback" }));
    await userEvent.click(screen.getByRole("checkbox"));

    // Act
    await writeAndSend();

    // Assert
    expect(eventProperties("survey sent")).toMatchObject({
      $survey_id: "feedback",
      feedback_source: "sidebar",
      "$survey_response_feedback-question": "Faster lists",
      [feedbackContactEmailProperty]: "staff@example.com",
    });
    expect(eventProperties("survey dismissed")).toBeUndefined();
    expect(mockNotify).toHaveBeenCalledWith(expect.objectContaining({ status: "success" }));
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("sends feedback without the email when contact is not ticked", async () => {
    // Arrange
    renderFeedback();
    await userEvent.click(screen.getByRole("button", { name: "Send feedback" }));

    // Act
    await writeAndSend();

    // Assert
    expect(eventProperties("survey sent")).toHaveProperty(
      "$survey_response_feedback-question",
      "Faster lists",
    );
    expect(eventProperties("survey sent")).not.toHaveProperty(feedbackContactEmailProperty);
  });

  it("records a dismissal without sending feedback when closed", async () => {
    // Arrange
    renderFeedback();
    await userEvent.click(screen.getByRole("button", { name: "Send feedback" }));
    await userEvent.type(screen.getByRole("textbox"), "Draft");

    // Act
    await userEvent.keyboard("{Escape}");

    // Assert
    expect(eventProperties("survey dismissed")).toMatchObject({ feedback_source: "sidebar" });
    expect(eventProperties("survey sent")).toBeUndefined();
  });
});

describe("openFeedback", () => {
  it("opens a dialog and adds the caller's properties to every survey event", async () => {
    // Arrange
    renderFeedback();

    // Act
    act(() =>
      feedback.openFeedback({
        source: "command_menu",
        properties: {
          feedback_feature: "variants",
          feedback_source: "spoofed",
          $survey_id: "spoofed",
          [feedbackContactEmailProperty]: "someone@example.com",
        },
      }),
    );
    await writeAndSend();

    // Assert
    const expected = {
      feedback_feature: "variants",
      feedback_source: "command_menu",
      $survey_id: "feedback",
    };

    expect(eventProperties("survey shown")).toMatchObject(expected);
    expect(eventProperties("survey sent")).toMatchObject(expected);
    expect(eventProperties("survey sent")).not.toHaveProperty(feedbackContactEmailProperty);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("records a dismissal with the caller's properties when the dialog closes", async () => {
    // Arrange
    renderFeedback();
    act(() => feedback.openFeedback({ source: "prompt", properties: { feedback_feature: "x" } }));

    // Act
    await userEvent.keyboard("{Escape}");

    // Assert
    expect(eventProperties("survey dismissed")).toMatchObject({
      feedback_source: "prompt",
      feedback_feature: "x",
    });
  });

  it("focuses the feedback box when opened right after another dialog closes", async () => {
    // Arrange
    const OtherDialog = (): ReactNode => {
      const [open, setOpen] = useState(true);

      return (
        <DashboardModal open={open} onChange={() => setOpen(false)}>
          <DashboardModal.Content size="xs">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                feedback.openFeedback({ source: "command_menu" });
              }}
            >
              Share feedback
            </button>
          </DashboardModal.Content>
        </DashboardModal>
      );
    };

    renderFeedback(<OtherDialog />);

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Share feedback" }));

    // Assert
    expect(await screen.findByRole("textbox", { name: "What could we improve?" })).toHaveFocus();
  });

  it("does nothing when feedback is unavailable", () => {
    // Arrange
    mockAvailability.isAvailable = false;
    mockAvailability.survey = undefined;
    renderFeedback();

    // Act
    act(() => feedback.openFeedback({ source: "command_menu" }));

    // Assert
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(feedback.isAvailable).toBe(false);
  });

  it("opens and sends nothing to PostHog when there is no survey", async () => {
    // Arrange
    mockAvailability.survey = undefined;
    renderFeedback();

    // Act
    act(() => feedback.openFeedback({ source: "command_menu" }));
    await writeAndSend();

    // Assert
    expect(mockCapture).not.toHaveBeenCalled();
  });
});
