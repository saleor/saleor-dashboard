import completedIcon from "@assets/images/completed.svg";
import uncompletedIcon from "@assets/images/uncompleted.svg";
import { Accordion, Box, ChervonDownIcon, Skeleton, Text } from "@saleor/macaw-ui-next";
import SVG from "react-inlinesvg";

import { useOnboardingData } from "../hooks/useOnboardingData";
import { useOnboarding } from "../onboardingContext/OnboardingContext";

export const WelcomePageOnboardingAccordion = () => {
  const { toggleExpandedOnboardingStep, extendedStepId, loading } = useOnboarding();

  const { steps } = useOnboardingData();

  if (loading) {
    return (
      <Box display="grid" gap={3}>
        <Skeleton __width="100%" height={6} />
        <Skeleton __width="50%" height={6} />
        <Skeleton __width="75%" height={6} />
      </Box>
    );
  }

  return (
    <Accordion
      display="grid"
      gap={3}
      value={extendedStepId}
      onValueChange={value => {
        toggleExpandedOnboardingStep(value, extendedStepId);
      }}
    >
      {steps.map(step => (
        <Accordion.Item
          key={step.id}
          value={step.id}
          backgroundColor="default1"
          padding={6}
          borderWidth={1}
          borderColor="default1"
          borderStyle="solid"
          borderRadius={3}
          width="100%"
          boxShadow={extendedStepId === step.id ? "defaultFocused" : "none"}
        >
          <Accordion.Trigger alignItems="center" data-test-id={`accordion-step-trigger-${step.id}`}>
            <Box width="100%" display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center" gap={3.5}>
                <StepIcon isComplete={step.isCompleted} />
                <Text size={5} fontWeight="bold">
                  {step.title}
                </Text>
              </Box>

              <Box
                display="flex"
                alignItems="center"
                transition="ease"
                __transform={`${extendedStepId === step.id ? "rotate(180deg)" : "none"}`}
              >
                <ChervonDownIcon />
              </Box>
            </Box>
          </Accordion.Trigger>
          <Accordion.Content>
            <Box marginTop={3} marginLeft={9}>
              <Text>{step.description}</Text>
              {step.actions && (
                <Box display="flex" gap={4} marginTop={6} marginBottom={2} flexWrap="wrap">
                  {step.actions}
                </Box>
              )}
            </Box>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

function StepIcon({ isComplete }: { isComplete: boolean }) {
  if (isComplete) {
    return (
      <Box color="accent1">
        <SVG src={completedIcon} width={18} height={18} style={{ verticalAlign: "middle" }} />
      </Box>
    );
  }

  return (
    <Box color="default1">
      <SVG src={uncompletedIcon} width={18} height={18} style={{ verticalAlign: "middle" }} />
    </Box>
  );
}
