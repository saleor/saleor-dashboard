import { OnboardingState, StorageService } from "./types";

const ONBOARDING_STATE_KEY = "onboardingState";

export class OnboardingStorage implements StorageService {
  getOnboardingState() {
    try {
      const onboardingState = localStorage.getItem(ONBOARDING_STATE_KEY);

      if (!onboardingState) {
        return undefined;
      }

      const parsed = JSON.parse(onboardingState);

      return parsed;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("Could not get onboarding state from localStorage", { error });

      return undefined;
    }
  }

  saveOnboardingState(onboardingState: OnboardingState) {
    try {
      localStorage.setItem(ONBOARDING_STATE_KEY, JSON.stringify(onboardingState));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("Could not save onboarding state to localStorage");
    }
  }
}
