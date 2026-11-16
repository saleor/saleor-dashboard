import { act, renderHook } from "@testing-library/react";
import { Provider } from "jotai";
import {
  type PostHog,
  type Survey,
  SurveyEventName,
  SurveyQuestionType,
  SurveyType,
} from "posthog-js";

import { feedbackSurvey } from "./feedbackSurvey.fixture";
import { useFeedbackSurvey, useFeedbackSurveyDialog } from "./useFeedbackSurvey";

const mockPosthog = {
  onSurveysLoaded: jest.fn<
    ReturnType<PostHog["onSurveysLoaded"]>,
    Parameters<PostHog["onSurveysLoaded"]>
  >(),
  onFeatureFlags: jest.fn<
    ReturnType<PostHog["onFeatureFlags"]>,
    Parameters<PostHog["onFeatureFlags"]>
  >(),
  capture: jest.fn<ReturnType<PostHog["capture"]>, Parameters<PostHog["capture"]>>(),
  getActiveMatchingSurveys: jest.fn<
    ReturnType<PostHog["getActiveMatchingSurveys"]>,
    Parameters<PostHog["getActiveMatchingSurveys"]>
  >(),
};
const mockAnalyticsEnabled = jest.fn(() => true);
const mockSurveyId = jest.fn<string | undefined, []>(() => feedbackSurvey.id);

jest.mock("posthog-js/react", () => ({ usePostHog: () => mockPosthog }));
jest.mock("@dashboard/components/ProductAnalytics/config", () => ({
  isProductAnalyticsEnabled: () => mockAnalyticsEnabled(),
  getFeedbackSurveyId: () => mockSurveyId(),
}));

const loaded = mockPosthog.onSurveysLoaded;
const matching = mockPosthog.getActiveMatchingSurveys;

beforeEach(() => {
  jest.clearAllMocks();
  mockAnalyticsEnabled.mockReturnValue(true);
  mockSurveyId.mockReturnValue(feedbackSurvey.id);
  loaded.mockReturnValue(jest.fn());
  mockPosthog.onFeatureFlags.mockReturnValue(jest.fn());
  matching.mockImplementation(callback => callback([feedbackSurvey]));
});

it("stays hidden until the renderer loads and the feedback survey matches", () => {
  // Arrange
  const { result } = renderHook(useFeedbackSurvey);

  // Act
  expect(result.current.isAvailable).toBe(false);
  act(() => loaded.mock.calls[0][0]([feedbackSurvey], { isLoaded: true }));

  // Assert
  expect(result.current.isAvailable).toBe(true);
});

it("shows the feedback button in development when analytics is disabled", () => {
  // Arrange
  const originalNodeEnv = process.env.NODE_ENV;

  process.env.NODE_ENV = "development";
  mockAnalyticsEnabled.mockReturnValue(false);

  try {
    // Act
    const { result } = renderHook(useFeedbackSurvey);

    // Assert
    expect(result.current.isAvailable).toBe(true);
    expect(loaded).not.toHaveBeenCalled();
    expect(matching).not.toHaveBeenCalled();
  } finally {
    process.env.NODE_ENV = originalNodeEnv;
  }
});

it("stays hidden when loading fails", () => {
  // Arrange
  const { result } = renderHook(useFeedbackSurvey);

  // Act
  act(() => loaded.mock.calls[0][0]([], { isLoaded: false, error: "blocked" }));

  // Assert
  expect(result.current.isAvailable).toBe(false);
  expect(matching).not.toHaveBeenCalled();
});

const inactiveSurveys: { name: string; survey: Survey }[] = [
  { name: "another survey", survey: { ...feedbackSurvey, id: "other-survey" } },
  {
    name: "a survey PostHog draws itself",
    survey: { ...feedbackSurvey, type: SurveyType.Popover },
  },
  {
    name: "a survey with a rating question",
    survey: {
      ...feedbackSurvey,
      questions: [
        {
          id: "rating",
          type: SurveyQuestionType.Rating,
          question: "How likely are you to recommend us?",
          display: "number",
          scale: 10,
          lowerBoundLabel: "Unlikely",
          upperBoundLabel: "Very likely",
        },
      ],
    },
  },
];

for (const { name, survey } of inactiveSurveys) {
  it(`stays hidden when only ${name} is active`, () => {
    // Arrange
    matching.mockImplementation(callback => callback([survey]));

    const { result } = renderHook(useFeedbackSurvey);

    // Act
    act(() => loaded.mock.calls[0][0]([survey], { isLoaded: true }));

    // Assert
    expect(result.current.isAvailable).toBe(false);
  });
}

it("stays hidden when no feedback survey is configured", () => {
  // Arrange
  mockSurveyId.mockReturnValue(undefined);

  // Act
  const { result } = renderHook(useFeedbackSurvey);

  // Assert
  expect(result.current.isAvailable).toBe(false);
  expect(loaded).not.toHaveBeenCalled();
});

it("updates availability after feature flag changes and unsubscribes on unmount", () => {
  // Arrange
  const unsubscribe = jest.fn();

  loaded.mockReturnValue(unsubscribe);

  const { result, unmount } = renderHook(useFeedbackSurvey);

  act(() => loaded.mock.calls[0][0]([feedbackSurvey], { isLoaded: true }));
  matching.mockImplementation(callback => callback([]));

  // Act
  act(() => mockPosthog.onFeatureFlags.mock.calls[0][0]([], {}));
  unmount();

  // Assert
  expect(result.current.isAvailable).toBe(false);
  expect(unsubscribe).toHaveBeenCalled();
});

it("stays hidden in production when analytics is disabled", () => {
  // Arrange
  const originalNodeEnv = process.env.NODE_ENV;

  process.env.NODE_ENV = "production";
  mockAnalyticsEnabled.mockReturnValue(false);

  try {
    // Act
    const { result } = renderHook(useFeedbackSurvey);

    // Assert
    expect(result.current.isAvailable).toBe(false);
    expect(loaded).not.toHaveBeenCalled();
    expect(matching).not.toHaveBeenCalled();
  } finally {
    process.env.NODE_ENV = originalNodeEnv;
  }
});

// Every hook instance subscribes, and PostHog notifies each of them.
const loadSurveys = (surveys: Survey[]): void =>
  loaded.mock.calls.forEach(([callback]) => callback(surveys, { isLoaded: true }));

const renderFeedbackSurvey = () =>
  renderHook(() => ({ entry: useFeedbackSurvey(), dialog: useFeedbackSurveyDialog() }), {
    wrapper: Provider,
  });

it("opens the dialog with the survey and where it was opened from", () => {
  // Arrange
  const { result } = renderFeedbackSurvey();

  act(() => loadSurveys([feedbackSurvey]));

  // Act
  act(() => result.current.entry.openSurvey({ source: "command_menu" }));

  // Assert
  expect(result.current.dialog.survey).toEqual(feedbackSurvey);
  expect(result.current.dialog.openedFrom).toBe("command_menu");
  expect(mockPosthog.capture).toHaveBeenCalledTimes(1);
  expect(mockPosthog.capture).toHaveBeenCalledWith(
    SurveyEventName.SHOWN,
    expect.objectContaining({ $survey_id: feedbackSurvey.id, feedback_source: "command_menu" }),
  );
});

it("closes the dialog", () => {
  // Arrange
  const { result } = renderFeedbackSurvey();

  act(() => loadSurveys([feedbackSurvey]));
  act(() => result.current.entry.openSurvey({ source: "sidebar" }));

  // Act
  act(() => result.current.dialog.close());

  // Assert
  expect(result.current.dialog.openedFrom).toBeNull();
});

it("opens nothing when no feedback survey matches", () => {
  // Arrange
  matching.mockImplementation(callback => callback([]));

  const { result } = renderFeedbackSurvey();

  act(() => loadSurveys([]));

  // Act
  act(() => result.current.entry.openSurvey({ source: "command_menu" }));

  // Assert
  expect(result.current.dialog.openedFrom).toBeNull();
  expect(mockPosthog.capture).not.toHaveBeenCalled();
});
