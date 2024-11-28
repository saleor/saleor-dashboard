import { DashboardCard } from "@dashboard/components/Card";
import { TOTAL_STEPS_COUNT } from "@dashboard/welcomePage/WelcomePageOnboarding/onboardingContext/initialOnboardingState";
import { Accordion, Box, Button, ChervonDownIcon, Text } from "@saleor/macaw-ui-next";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { WelcomePageOnboardingAccordion } from "./components/WelcomePageOnboardingAccordion";
import { useOnboarding } from "./onboardingContext/OnboardingContext";

type TitleProps = {
  isOnboardingCompleted: boolean;
  status: {
    done: number;
    total: number;
  };
};

export const WelcomePageOnboarding = () => {
  const { markAllAsCompleted, isOnboardingCompleted, toggleOnboarding, onboardingState } =
    useOnboarding();

  const isOnboardingExpanded = onboardingState.onboardingExpanded;
  const status = {
    done: onboardingState.stepsCompleted.length,
    total: TOTAL_STEPS_COUNT,
  };

  const handleMarkAllAsCompleted = () => {
    markAllAsCompleted();
  };

  return (
    <DashboardCard borderRadius={3} borderColor="default1" borderWidth={1} borderStyle="solid">
      <Accordion
        value={isOnboardingExpanded ? "onboarding" : ""}
        onValueChange={value => {
          toggleOnboarding(value === "onboarding");
        }}
      >
        <Accordion.Item value="onboarding">
          <DashboardCard.Header padding={6}>
            <Title isOnboardingCompleted={isOnboardingCompleted} status={status} />

            <Box display="flex" flexDirection="row" alignItems="center" gap={4}>
              {!isOnboardingCompleted && (
                <Button variant="secondary" onClick={handleMarkAllAsCompleted}>
                  <FormattedMessage
                    defaultMessage="Mark all as done"
                    id="ipbT0Q"
                    description="btn label"
                  />
                </Button>
              )}
              <Accordion.Trigger>
                <Box
                  display="flex"
                  alignItems="center"
                  transition="ease"
                  __transform={`${isOnboardingExpanded ? "rotate(180deg)" : "none"}`}
                >
                  <ChervonDownIcon />
                </Box>
              </Accordion.Trigger>
            </Box>
          </DashboardCard.Header>

          <Accordion.Content>
            <DashboardCard.Content padding={6} paddingTop={0}>
              <WelcomePageOnboardingAccordion />
            </DashboardCard.Content>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </DashboardCard>
  );
};

const Title = ({ isOnboardingCompleted, status }: TitleProps) => {
  if (isOnboardingCompleted) {
    return (
      <Text size={7}>
        <FormattedMessage
          defaultMessage="Onboarding completed 🎉"
          id="loEfAh"
          description="onboarding completed message"
        />
      </Text>
    );
  }

  return (
    <Text size={7}>
      <FormattedMessage
        defaultMessage="Let’s Get Started ({count}/{total})"
        id="iIPThY"
        description="onboarding title"
        values={{
          count: status.done,
          total: status.total,
        }}
      />
    </Text>
  );
};
