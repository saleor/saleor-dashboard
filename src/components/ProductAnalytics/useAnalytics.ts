import { usePostHog } from "posthog-js/react";
import { useCallback } from "react";

import { useRouteChange } from "../Router/useRouteChange";
import { type AnalyticsEventArguments, type AnalyticsEventName, type TrackEvent } from "./events";
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
  trackEvent: TrackEvent;
}

export function useAnalytics(): Analytics {
  const posthog = usePostHog();

  const trackEvent: TrackEvent = useCallback(
    <EventName extends AnalyticsEventName>(
      ...[event, properties]: AnalyticsEventArguments<EventName>
    ) => {
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

  function initialize(userProperties: UserProperties, context: AnalyticsContext): void {
    if (!posthog) return;

    posthog.register(context);
    register();

    const id = posthog.get_distinct_id();

    posthog.identify(id, userProperties);
  }

  return { trackEvent, initialize };
}
