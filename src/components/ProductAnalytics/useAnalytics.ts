import { usePostHog } from "posthog-js/react";

export function useAnalytics() {
  const posthog = usePostHog();

  function initialize(details: Record<string, any>) {
    // According to docs, posthog can be briefly undefined
    if (!posthog) return;

    const id = posthog.get_distinct_id();

    posthog.identify(id, details);
  }

  function reset() {
    if (!posthog) return;

    posthog.reset();
  }

  function trackEvent(event: string, properties?: Record<string, any>) {
    if (!posthog) return;

    posthog.capture(event, properties);
  }

  return { initialize, reset, trackEvent };
}
