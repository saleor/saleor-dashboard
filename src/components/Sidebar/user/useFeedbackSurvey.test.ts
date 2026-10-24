import { act, renderHook } from "@testing-library/react";
import { type PostHog, type Survey, SurveyType, SurveyWidgetType } from "posthog-js";

import { useFeedbackSurvey } from "./useFeedbackSurvey";

const mockPosthog = {
  onSurveysLoaded: jest.fn<
    ReturnType<PostHog["onSurveysLoaded"]>,
    Parameters<PostHog["onSurveysLoaded"]>
  >(),
  onFeatureFlags: jest.fn<
    ReturnType<PostHog["onFeatureFlags"]>,
    Parameters<PostHog["onFeatureFlags"]>
  >(),
  getActiveMatchingSurveys: jest.fn<
    ReturnType<PostHog["getActiveMatchingSurveys"]>,
    Parameters<PostHog["getActiveMatchingSurveys"]>
  >(),
};
const mockAnalyticsEnabled = jest.fn(() => true);

jest.mock("posthog-js/react", () => ({ usePostHog: () => mockPosthog }));
jest.mock("@dashboard/components/ProductAnalytics/config", () => ({
  isProductAnalyticsEnabled: () => mockAnalyticsEnabled(),
}));

const feedbackSurvey: Survey = {
  id: "feedback",
  name: "Feedback",
  description: "",
  type: SurveyType.Widget,
  appearance: {
    widgetType: SurveyWidgetType.Selector,
    widgetSelector: '[data-posthog-feedback-trigger="true"]',
  },
  conditions: {
    selector: '[data-posthog-feedback-trigger="true"]',
    events: null,
    cancelEvents: null,
    actions: null,
  },
  questions: [],
  start_date: "2026-09-01",
  end_date: null,
  feature_flag_keys: null,
  linked_flag_key: null,
  targeting_flag_key: null,
  internal_targeting_flag_key: null,
  current_iteration: null,
  current_iteration_start_date: null,
};

const loaded = mockPosthog.onSurveysLoaded;
const matching = mockPosthog.getActiveMatchingSurveys;

beforeEach(() => {
  jest.clearAllMocks();
  mockAnalyticsEnabled.mockReturnValue(true);
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

it("stays hidden when only another survey is available", () => {
  // Arrange
  matching.mockImplementation(callback =>
    callback([{ ...feedbackSurvey, appearance: { widgetSelector: "#other" } }]),
  );

  const { result } = renderHook(useFeedbackSurvey);

  // Act
  act(() => loaded.mock.calls[0][0]([feedbackSurvey], { isLoaded: true }));

  // Assert
  expect(result.current.isAvailable).toBe(false);
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
