import { usePostHog } from "posthog-js/react";
import { useCallback } from "react";

import { useRouteChange } from "../Router/useRouteChange";
import { sanitizeAnalyticsPath } from "./sanitizeAnalyticsUrl";

interface UserProperties {
  domain: string;
  email_domain: string;
}

interface AnalyticsContext {
  dashboard_version: string;
  saleor_version: string;
}

interface Analytics {
  initialize: (userProperties: UserProperties, context: AnalyticsContext) => void;
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
    const normalizedPath = sanitizeAnalyticsPath(location.pathname);
    const dashboardArea = normalizedPath.split("/").find(Boolean) ?? "home";

    posthog.register({ dashboard_area: dashboardArea });
    trackEvent("$pageview", {
      normalized_path: normalizedPath,
    });
  });

  function initialize(userProperties: UserProperties, context: AnalyticsContext) {
    if (!posthog) return;

    posthog.register(context);
    register();

    const id = posthog.get_distinct_id();

    posthog.identify(id, userProperties);
  }

  return { trackEvent, initialize };
}
