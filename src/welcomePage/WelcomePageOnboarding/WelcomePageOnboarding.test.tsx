import { useUser } from "@dashboard/auth";
import { ApolloMockedProvider } from "@test/ApolloMockedProvider";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";

import { onboardingCompletedMock, onboardingInitState } from "./mocks";
import { OnboardingProvider } from "./onboardingContext";
import { useOnboardingStorage } from "./onboardingContext/useOnboardingStorage";
import { WelcomePageOnboarding } from "./WelcomePageOnboarding";

jest.mock("@dashboard/auth");
jest.mock("@dashboard/featureFlags", () => ({
  useFlag: jest.fn().mockReturnValue({
    enabled: true,
  }),
}));
jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
  FormattedMessage: ({ defaultMessage }: { defaultMessage: any }) => <>{defaultMessage}</>,
}));
jest.mock("./onboardingContext/useOnboardingStorage");
jest.useFakeTimers();
jest.mock("@dashboard/components/DevModePanel/hooks", () => ({
  useDevModeContext: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  Link: jest.fn(({ to, ...props }) => <a href={to} {...props} />),
}));

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ApolloMockedProvider>
    <OnboardingProvider>{children}</OnboardingProvider>
  </ApolloMockedProvider>
);

const OLD_ACCOUNT_DATE = "2022-12-31";
const NEW_ACCOUNT_DATE = "2024-12-31";
const onboardingCompleteMessage = "Onboarding completed 🎉";
const allMarkAsDoneStepsIds = [
  "create-product",
  "explore-orders",
  "graphql-playground",
  "view-webhooks",
  "invite-staff",
];

describe("WelcomePageOnboarding", () => {
  it("should show 'Onboarding completed' when user's account is older than set date", () => {
    // Arrange
    (useUser as jest.Mock).mockReturnValue({ user: { dateJoined: OLD_ACCOUNT_DATE } });
    (useOnboardingStorage as jest.Mock).mockReturnValue({
      getOnboardingState: jest.fn(() => onboardingInitState),
      saveOnboardingState: jest.fn(),
    });

    // Act
    const { getByText } = render(
      <Wrapper>
        <WelcomePageOnboarding />
      </Wrapper>,
    );

    // Assert
    expect(getByText(onboardingCompleteMessage)).toBeInTheDocument();
    expect(screen.getByTestId("onboarding-accordion-item")).toHaveAttribute("data-state", "closed");
  });

  it("should save onboarding expanded state to storage service", async () => {
    // Arrange
    const saveOnboardingState = jest.fn();

    (useUser as jest.Mock).mockReturnValue({ user: { dateJoined: NEW_ACCOUNT_DATE } });
    (useOnboardingStorage as jest.Mock).mockReturnValue({
      getOnboardingState: jest.fn(() => onboardingInitState),
      saveOnboardingState,
    });

    // Act
    render(
      <Wrapper>
        <WelcomePageOnboarding />
      </Wrapper>,
    );

    screen.getByTestId("onboarding-accordion-trigger").click();
    jest.runAllTimers();

    // Assert
    expect(saveOnboardingState).toHaveBeenNthCalledWith(3, {
      onboardingExpanded: false,
      stepsCompleted: [],
      stepsExpanded: {},
    });
    expect(screen.getByTestId("onboarding-accordion-item")).toHaveAttribute("data-state", "closed");
  });

  it("should show 'Onboarding completed' when 'Mark all as done' is clicked", () => {
    // Arrange
    (useUser as jest.Mock).mockReturnValue({ user: { dateJoined: NEW_ACCOUNT_DATE } });
    (useOnboardingStorage as jest.Mock).mockReturnValue({
      getOnboardingState: jest.fn(() => onboardingInitState),
      saveOnboardingState: jest.fn(),
    });

    // Act
    render(
      <Wrapper>
        <WelcomePageOnboarding />
      </Wrapper>,
    );

    screen.getByTestId("mark-as-done").click();

    // Assert
    expect(screen.getByText(onboardingCompleteMessage)).toBeInTheDocument();
    expect(screen.getByTestId("onboarding-accordion-item")).toHaveAttribute("data-state", "open");
    expect(screen.queryByText("Mark all as done")).toBeNull();
  });

  it("should show 'Onboarding completed' after marking each steps as done", () => {
    // Arrange
    (useUser as jest.Mock).mockReturnValue({ user: { dateJoined: NEW_ACCOUNT_DATE } });
    (useOnboardingStorage as jest.Mock).mockReturnValue({
      getOnboardingState: jest.fn(() => onboardingInitState),
      saveOnboardingState: jest.fn(),
    });

    // Act
    render(
      <Wrapper>
        <WelcomePageOnboarding />
      </Wrapper>,
    );

    // 'get-started' has only 'Next step' button
    const getStartedNextStepBtn = screen.getByTestId("get-started-next-step-btn");

    getStartedNextStepBtn.click();

    allMarkAsDoneStepsIds.forEach(stepId => {
      const markAsDone = screen.getByTestId(stepId + "-mark-as-done");

      markAsDone.click();
    });

    // Assert
    expect(screen.getByText(onboardingCompleteMessage)).toBeInTheDocument();
  });

  it("should show 'Onboarding completed' when all steps were completed", () => {
    // Arrange
    (useUser as jest.Mock).mockReturnValue({ user: { dateJoined: NEW_ACCOUNT_DATE } });
    (useOnboardingStorage as jest.Mock).mockReturnValue({
      getOnboardingState: jest.fn(() => onboardingCompletedMock),
      saveOnboardingState: jest.fn(),
    });

    // Act
    const { getByText } = render(
      <Wrapper>
        <WelcomePageOnboarding />
      </Wrapper>,
    );

    // Assert
    expect(getByText(onboardingCompleteMessage)).toBeInTheDocument();
  });

  it("clicking 'Next step' should save the status to storage service", async () => {
    // Arrange
    const saveOnboardingState = jest.fn();

    (useUser as jest.Mock).mockReturnValue({ user: { dateJoined: NEW_ACCOUNT_DATE } });
    (useOnboardingStorage as jest.Mock).mockReturnValue({
      getOnboardingState: jest.fn(() => onboardingInitState),
      saveOnboardingState,
    });

    // Act
    render(
      <Wrapper>
        <WelcomePageOnboarding />
      </Wrapper>,
    );

    screen.getByTestId("get-started-next-step-btn").click();
    jest.runAllTimers();

    // Assert
    expect(saveOnboardingState).toBeCalledWith({
      onboardingExpanded: true,
      stepsCompleted: ["get-started"],
      stepsExpanded: {},
    });
  });

  it("clicking any 'Mark as done' should save the status to storage service with 'get-started' step", async () => {
    // Arrange
    const saveOnboardingState = jest.fn();

    (useUser as jest.Mock).mockReturnValue({ user: { dateJoined: NEW_ACCOUNT_DATE } });
    (useOnboardingStorage as jest.Mock).mockReturnValue({
      getOnboardingState: jest.fn(() => onboardingInitState),
      saveOnboardingState,
    });

    // Act
    render(
      <Wrapper>
        <WelcomePageOnboarding />
      </Wrapper>,
    );

    // Any step:
    const graphqlPlaygroundId = "graphql-playground";
    const exploreGraphql = screen.getByTestId("accordion-step-trigger-" + graphqlPlaygroundId);

    exploreGraphql.click();

    const markAsDone = screen.getByTestId(graphqlPlaygroundId + "-mark-as-done");

    markAsDone.click();

    jest.runAllTimers();

    // Assert
    await waitFor(() => {
      expect(saveOnboardingState).toHaveBeenCalledWith({
        onboardingExpanded: true,
        stepsCompleted: ["get-started", graphqlPlaygroundId],
        stepsExpanded: {},
      });
    });
  });
});
