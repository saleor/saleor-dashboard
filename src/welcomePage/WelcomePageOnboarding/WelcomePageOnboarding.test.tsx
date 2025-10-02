import { useUser } from "@dashboard/auth";
import { useFlag } from "@dashboard/featureFlags";
import { ApolloMockedProvider } from "@test/ApolloMockedProvider";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";

import { onboardingCompletedMock, onboardingInitState } from "./mocks";
import { OnboardingProvider } from "./onboardingContext";
import { useOnboardingStorage } from "./onboardingContext/useOnboardingStorage";
import { WelcomePageOnboarding } from "./WelcomePageOnboarding";

jest.mock("@dashboard/components/Router/useRouteChange", () => ({
  useRouteChange: () => ({
    register: jest.fn(),
  }),
}));
jest.mock("@dashboard/auth");
jest.mock("@dashboard/featureFlags", () => ({
  useFlag: jest.fn().mockReturnValue({
    enabled: false,
  }),
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
  "view-extensions",
  "invite-staff",
];

describe("WelcomePageOnboarding", () => {
  it("should show collapsed accordion with 'Onboarding completed' when user's account is older than set date", () => {
    // Arrange
    (useUser as jest.Mock).mockReturnValue({ user: { dateJoined: OLD_ACCOUNT_DATE } });
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

    // Assert
    expect(screen.getByText(onboardingCompleteMessage)).toBeInTheDocument();
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

  it("should show 'Onboarding completed' after marking each steps as done", async () => {
    // Arrange
    (useUser as jest.Mock).mockReturnValue({ user: { dateJoined: NEW_ACCOUNT_DATE } });
    (useOnboardingStorage as jest.Mock).mockReturnValue({
      getOnboardingState: jest.fn(() => onboardingInitState),
      saveOnboardingState: jest.fn(),
    });

    const user = userEvent.setup();

    // Act
    render(
      <Wrapper>
        <WelcomePageOnboarding />
      </Wrapper>,
    );

    // 'get-started' has only 'Next step' button
    const getStartedNextStepBtn = screen.getByTestId("get-started-next-step-btn");

    user.click(getStartedNextStepBtn);

    for (const stepId of allMarkAsDoneStepsIds) {
      await waitFor(() => {
        expect(screen.getByTestId(stepId + "-mark-as-done")).toBeInTheDocument();
      });

      const markAsDone = screen.getByTestId(stepId + "-mark-as-done");

      markAsDone.click();
    }

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
    render(
      <Wrapper>
        <WelcomePageOnboarding />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByText(onboardingCompleteMessage)).toBeInTheDocument();
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

  it("should show 'Discover extension capabilities' step when extensions flag is enabled", () => {
    // Arrange
    (useUser as jest.Mock).mockReturnValue({ user: { dateJoined: NEW_ACCOUNT_DATE } });
    (useOnboardingStorage as jest.Mock).mockReturnValue({
      getOnboardingState: jest.fn(() => onboardingInitState),
      saveOnboardingState: jest.fn(),
    });
    // Override useFlag mock for this specific test
    (useFlag as jest.Mock).mockImplementation((flag: string) => ({
      enabled: flag === "extensions",
    }));

    // Act
    render(
      <Wrapper>
        <WelcomePageOnboarding />
      </Wrapper>,
    );

    // Click through the first step to reveal others
    screen.getByTestId("get-started-next-step-btn").click();

    // Open the relevant step accordion
    screen.getByTestId("accordion-step-trigger-view-extensions").click();

    // Assert
    // Check for 'view-extensions' step
    expect(screen.getByText("Discover extension capabilities")).toBeInTheDocument();
    expect(screen.getByTestId("view-extensions-mark-as-done")).toBeInTheDocument();

    // Check that 'view-webhooks' step is NOT present
    expect(screen.queryByText("View webhooks functionalities")).not.toBeInTheDocument();
    expect(screen.queryByTestId("view-webhooks-mark-as-done")).not.toBeInTheDocument();
  });
});
