import { Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { Check } from "lucide-react";
import { Fragment, type ReactNode } from "react";

import styles from "./ModalSteps.module.css";

export interface ModalStep {
  label: ReactNode;
}

interface ModalStepsProps {
  currentStep: number;
  steps: ModalStep[];
}

export const ModalSteps = ({ currentStep, steps }: ModalStepsProps) => {
  return (
    <div className={styles.steps}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;
        const isPending = !isCompleted && !isActive;

        return (
          <Fragment key={stepNumber}>
            {index > 0 ? <span className={styles.connector} aria-hidden /> : null}
            <div className={styles.step}>
              <span
                className={clsx(
                  styles.stepCircle,
                  isPending && styles.stepCirclePending,
                  isActive && styles.stepCircleActive,
                  isCompleted && styles.stepCircleCompleted,
                )}
              >
                {isCompleted ? <Check size={12} strokeWidth={3} aria-hidden /> : stepNumber}
              </span>
              <Text
                size={2}
                fontWeight={isActive ? "bold" : "regular"}
                color={isActive ? "default1" : "default2"}
              >
                {step.label}
              </Text>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
};
