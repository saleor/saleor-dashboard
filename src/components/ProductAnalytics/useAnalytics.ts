import { usePostHog } from "posthog-js/react";

interface Analytics {
  initialize: (details: Record<string, any>) => void;
  trackEvent: (event: string, properties?: Record<string, any>) => void;
}

export function useAnalytics(): Analytics {
  const posthog = usePostHog();

  function initialize(details: Record<string, any>) {
    // According to docs, posthog can be briefly undefined
    if (!posthog) return;

    posthog.setPersonProperties(details);
  }

  function trackEvent(event: string, properties?: Record<string, any>) {
    if (!posthog) return;

    posthog.capture(event, properties);
  }

  return { initialize, trackEvent };
}
