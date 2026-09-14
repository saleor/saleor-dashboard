import { usePostHog } from "posthog-js/react";
import { useCallback } from "react";

import { useRouteChange } from "../Router/useRouteChange";
import { sanitizeAnalyticsPath } from "./sanitizeAnalyticsUrl";

interface UserProperties {
  domain: string;
  email_domain: string;
}

interface Analytics {
  initialize: (userProperties: UserProperties) => void;
  trackEvent: (event: string, properties?: Record<string, any>) => void;
}

export function useAnalytics(): Analytics {
  const posthog = usePostHog();

  const trackEvent = useCallback(
    (event: string, properties?: Record<string, any>) => {
      if (!posthog) return;

      posthog.capture(event, properties);
    },
    [posthog],
  );

  const { register } = useRouteChange(location => {
    trackEvent("$pageview", {
      normalized_path: sanitizeAnalyticsPath(location.pathname),
    });
  });

  function initialize(userProperties: UserProperties) {
    if (!posthog) return;

    register();

    const id = posthog.get_distinct_id();

    posthog.identify(id, userProperties);
  }

  return { trackEvent, initialize };
}
