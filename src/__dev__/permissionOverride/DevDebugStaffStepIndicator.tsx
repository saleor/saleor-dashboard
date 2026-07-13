// DEV-ONLY-PERMISSION-OVERRIDE: see ./store.ts header for removal instructions.
import { Box, Text } from "@saleor/macaw-ui-next";

const STEP_LABELS = ["Permissions", "Create", "Password", "Log in"] as const;

export type DebugStaffFlowStep = 1 | 2 | 3 | 4;

interface DevDebugStaffStepIndicatorProps {
  currentStep: DebugStaffFlowStep;
}

export const DevDebugStaffStepIndicator = ({
  currentStep,
}: DevDebugStaffStepIndicatorProps): JSX.Element => (
  <Box display="flex" flexWrap="wrap" gap={1} alignItems="center">
    {STEP_LABELS.map((label, index) => {
      const step = (index + 1) as DebugStaffFlowStep;
      const isComplete = step < currentStep;
      const isCurrent = step === currentStep;

      return (
        <Box key={label} display="flex" alignItems="center" gap={1}>
          {index > 0 && (
            <Text size={1} color="default2">
              →
            </Text>
          )}
          <Text
            size={1}
            fontWeight={isCurrent ? "bold" : "regular"}
            color={isComplete ? "default1" : isCurrent ? "default1" : "default2"}
          >
            {isComplete ? `✓ ${label}` : `${step}. ${label}`}
          </Text>
        </Box>
      );
    })}
  </Box>
);
