import { ThemeProvider } from "@saleor/macaw-ui-next";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SurveyEventName } from "posthog-js";
import { type ReactNode } from "react";
import { IntlProvider } from "react-intl";

import { featureRequestSurvey, feedbackSurvey } from "./feedbackSurvey.fixture";
import { FeedbackSurveyDialog } from "./FeedbackSurveyDialog";
import { type useFeedbackSurveyDialog } from "./useFeedbackSurvey";

const mockCapture = jest.fn();
const mockNotify = jest.fn();
const mockClose = jest.fn();
const openDialog = (): ReturnType<typeof useFeedbackSurveyDialog> => ({
  dialog: { survey: feedbackSurvey, source: "sidebar", open: true },
  close: mockClose,
});
const mockDialog = jest.fn(openDialog);

jest.mock("posthog-js/react", () => ({ usePostHog: () => ({ capture: mockCapture }) }));
jest.mock("@dashboard/hooks/useNotifier/useNotifier", () => ({ useNotifier: () => mockNotify }));
jest.mock("./useFeedbackSurvey", () => ({ useFeedbackSurveyDialog: () => mockDialog() }));

const Wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider defaultLocale="en" locale="en">
    <ThemeProvider>{children}</ThemeProvider>
  </IntlProvider>
);

const [question] = feedbackSurvey.questions;
const responseKey = `$survey_response_${question.id}`;

beforeEach(() => {
  jest.clearAllMocks();
  mockDialog.mockImplementation(openDialog);
});

it("shows the survey question and its description", () => {
  // Arrange & Act
  render(<FeedbackSurveyDialog />, { wrapper: Wrapper });

  // Assert
  expect(screen.getByText(question.question)).toBeInTheDocument();
  expect(screen.getByText(question.description!)).toBeInTheDocument();
  expect(mockCapture).not.toHaveBeenCalled();
});

it("sends the response with where the survey was opened from", async () => {
  // Arrange
  const user = userEvent.setup();

  render(<FeedbackSurveyDialog />, { wrapper: Wrapper });

  const send = screen.getByRole("button", { name: "Send" });

  expect(send).toBeDisabled();

  // Act
  await user.type(screen.getByRole("textbox", { name: question.question }), "  Faster search  ");
  await user.click(send);

  // Assert
  expect(mockCapture).toHaveBeenLastCalledWith(SurveyEventName.SENT, {
    $survey_name: feedbackSurvey.name,
    $survey_id: feedbackSurvey.id,
    $survey_iteration: null,
    $survey_iteration_start_date: null,
    feedback_source: "sidebar",
    $survey_questions: [
      { id: question.id, question: question.question, response: "Faster search" },
    ],
    [responseKey]: "Faster search",
    $survey_completed: true,
    $set: { [`$survey_responded/${feedbackSurvey.id}`]: true },
  });
  expect(mockClose).toHaveBeenCalled();
  expect(mockNotify).toHaveBeenCalledWith({ status: "success", title: "Feedback sent" });
});

it("asks the question of the survey it was opened with and sends the answer to it", async () => {
  // Arrange
  const user = userEvent.setup();
  const [featureQuestion] = featureRequestSurvey.questions;

  mockDialog.mockReturnValue({
    dialog: { survey: featureRequestSurvey, source: "whats_new", open: true },
    close: mockClose,
  });
  render(<FeedbackSurveyDialog />, { wrapper: Wrapper });

  // Act
  await user.type(
    screen.getByRole("textbox", { name: featureQuestion.question }),
    "Bulk price editing",
  );
  await user.click(screen.getByRole("button", { name: "Send" }));

  // Assert
  expect(screen.queryByText(question.question)).not.toBeInTheDocument();
  expect(screen.getByText(featureQuestion.description!)).toBeInTheDocument();
  expect(mockCapture).toHaveBeenLastCalledWith(
    SurveyEventName.SENT,
    expect.objectContaining({
      $survey_id: featureRequestSurvey.id,
      feedback_source: "whats_new",
      [`$survey_response_${featureQuestion.id}`]: "Bulk price editing",
    }),
  );
});

it("keeps Send disabled when nothing visible is typed", async () => {
  // Arrange
  const user = userEvent.setup();

  render(<FeedbackSurveyDialog />, { wrapper: Wrapper });

  const textbox = screen.getByRole("textbox", { name: question.question });
  const send = screen.getByRole("button", { name: "Send" });

  // Act
  await user.type(textbox, "   {Enter}{Enter}\u200b\u00a0");
  await user.click(send);

  // Assert
  expect(send).toBeDisabled();
  expect(mockCapture).not.toHaveBeenCalled();
  expect(mockClose).not.toHaveBeenCalled();

  // Act
  await user.type(textbox, "x");

  // Assert
  expect(send).toBeEnabled();
});

it("records a dismissal without the unsent text", async () => {
  // Arrange
  const user = userEvent.setup();

  render(<FeedbackSurveyDialog />, { wrapper: Wrapper });
  await user.type(screen.getByRole("textbox", { name: question.question }), "Never mind");

  // Act
  await user.click(screen.getByRole("button", { name: "Cancel" }));

  // Assert
  expect(mockCapture).toHaveBeenLastCalledWith(
    SurveyEventName.DISMISSED,
    expect.objectContaining({
      $survey_id: feedbackSurvey.id,
      feedback_source: "sidebar",
      $set: { [`$survey_dismissed/${feedbackSurvey.id}`]: true },
    }),
  );
  expect(JSON.stringify(mockCapture.mock.calls)).not.toContain("Never mind");
  expect(mockClose).toHaveBeenCalled();
  expect(mockNotify).not.toHaveBeenCalled();
});

it("stays closed and records nothing until it is opened", () => {
  // Arrange
  mockDialog.mockReturnValue({ dialog: null, close: mockClose });

  // Act
  render(<FeedbackSurveyDialog />, { wrapper: Wrapper });

  // Assert
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(mockCapture).not.toHaveBeenCalled();
});

it("keeps the closed survey rendered closed, so it can animate out", () => {
  // Arrange
  mockDialog.mockReturnValue({
    dialog: { survey: feedbackSurvey, source: "sidebar", open: false },
    close: mockClose,
  });

  // Act
  render(<FeedbackSurveyDialog />, { wrapper: Wrapper });

  // Assert
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(mockCapture).not.toHaveBeenCalled();
});
