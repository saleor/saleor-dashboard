import { useState } from "react";

export interface UseWizardOpts<T> {
  next: () => void;
  prev: () => void;
  set: (step: T) => void;
}
export type UseWizard<T> = [T, UseWizardOpts<T>];
function useWizard<T>(initial: T, steps: T[]): UseWizard<T> {
  const [stepIndex, setStepIndex] = useState(steps.indexOf(initial));

  function next() {
    if (stepIndex === steps.length - 1) {
      console.error("This is the last step");
    } else {
      setStepIndex(stepIndex + 1);
    }
  }

  function prev() {
    if (stepIndex === 0) {
      console.error("This is the first step");
    } else {
      setStepIndex(stepIndex - 1);
    }
  }

  function set(step: T) {
    const newStepIndex = steps.findIndex(s => s === step);
    if (newStepIndex === -1) {
      console.error("Step does not exist");
    } else {
      setStepIndex(newStepIndex);
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
