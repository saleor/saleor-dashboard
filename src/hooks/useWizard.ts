import { useState } from "react";

export interface UseWizardActions<T> {
  next: () => void;
  prev: () => void;
  set: (step: T) => void;
}
export interface UseWizardOpts<T> {
  onTransition: (prevStep: T, nextStep: T) => void;
}
export type UseWizard<T> = [T, UseWizardActions<T>];
function useWizard<T>(
  initial: T,
  steps: T[],
  opts?: UseWizardOpts<T>
): UseWizard<T> {
  const [stepIndex, setStepIndex] = useState(steps.indexOf(initial));

  function goToStep(nextStepIndex) {
    if (typeof opts?.onTransition === "function") {
      opts.onTransition(steps[stepIndex], steps[nextStepIndex]);
    }
    setStepIndex(nextStepIndex);
  }

  function next() {
    if (stepIndex === steps.length - 1) {
      console.error("This is the last step");
    } else {
      goToStep(stepIndex + 1);
    }
  }

  function prev() {
    if (stepIndex === 0) {
      console.error("This is the first step");
    } else {
      goToStep(stepIndex - 1);
    }
  }

  function set(step: T) {
    const newStepIndex = steps.findIndex(s => s === step);
    if (newStepIndex === -1) {
      console.error("Step does not exist");
    } else {
      goToStep(newStepIndex);
    }
  }

  return [
    steps[stepIndex],
    {
      next,
      prev,
      set
    }
  ];
}

export default useWizard;
