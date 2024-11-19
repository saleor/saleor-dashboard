import { Card, CardContent, CardHeader } from "@material-ui/core";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { HomeOnboardingAccordion } from "./HomeOnboardingAccordion";
import { useOnboarding } from "./onboardingContext/OnboardingContext";

const HomeOnboarding = () => {
  const { markAllAsCompleted, isOnboardingCompleted } = useOnboarding();

  const handleMarkAllAsCompleted = () => {
    markAllAsCompleted();
  };

  return (
    <Card>
      <CardHeader
        title={
          <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
            <Title isOnboardingCompleted={isOnboardingCompleted} />
            {!isOnboardingCompleted && (
              <Button variant="secondary" onClick={handleMarkAllAsCompleted}>
                <FormattedMessage
                  defaultMessage="Mark all as done"
                  id="ipbT0Q"
                  description="btn label"
                />
              </Button>
            )}
          </Box>
        }
      />
      <CardContent>
        <HomeOnboardingAccordion />
      </CardContent>
    </Card>
  );
};

function Title({ isOnboardingCompleted }: { isOnboardingCompleted: boolean }) {
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
        defaultMessage="Let’s Get Started"
        id="SzqT+H"
        description="onboarding title"
      />
    </Text>
  );
}

export default HomeOnboarding;
