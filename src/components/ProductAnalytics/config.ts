const isDomainExcluded = (): boolean => {
  const domainsString = process.env.POSTHOG_EXCLUDED_DOMAINS;

  if (!domainsString) {
    return false;
  }

  const excludedDomains = domainsString.split(",");

  return excludedDomains.some(domain => window.location.hostname.includes(domain));
};

export const isProductAnalyticsEnabled = (): boolean =>
  Boolean(
    process.env.IS_CLOUD_INSTANCE &&
    process.env.POSTHOG_HOST &&
    process.env.POSTHOG_KEY &&
    !isDomainExcluded(),
  );

/** The PostHog survey the Dashboard shows in its own feedback dialog. */
export const getFeedbackSurveyId = (): string | undefined =>
  process.env.POSTHOG_FEEDBACK_SURVEY_ID || undefined;

/** The PostHog survey that asks for feature requests, from What's New. */
export const getFeatureRequestSurveyId = (): string | undefined =>
  process.env.POSTHOG_FEATURE_REQUEST_SURVEY_ID || undefined;
