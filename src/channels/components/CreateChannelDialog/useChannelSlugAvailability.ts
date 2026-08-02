import { useChannelBySlugQuery } from "@dashboard/graphql";
import { useEffect, useState } from "react";

export const CHANNEL_SLUG_CHECK_DEBOUNCE_MS = 500;

interface ChannelSlugAvailability {
  /** True while waiting for debounce or an in-flight lookup for the current slug. */
  isChecking: boolean;
  /** True when the current slug is confirmed taken. */
  isTaken: boolean;
}

/**
 * Debounced uniqueness check for channel slugs via `channel(slug:)`.
 * Fails open on errors so create can still rely on mutation validation.
 */
export const useChannelSlugAvailability = (slug: string): ChannelSlugAvailability => {
  const trimmedSlug = slug.trim();
  const [debouncedSlug, setDebouncedSlug] = useState(trimmedSlug);

  useEffect(
    function debounceChannelSlugCheck() {
      const timer = window.setTimeout(() => {
        setDebouncedSlug(trimmedSlug);
      }, CHANNEL_SLUG_CHECK_DEBOUNCE_MS);

      return () => window.clearTimeout(timer);
    },
    [trimmedSlug],
  );

  const skip = !debouncedSlug;
  const { data, loading } = useChannelBySlugQuery({
    displayLoader: false,
    fetchPolicy: "network-only",
    handleError: () => undefined,
    skip,
    variables: { slug: debouncedSlug },
  });

  const isSettledOnCurrentSlug = debouncedSlug === trimmedSlug;

  return {
    isChecking: !!trimmedSlug && (!isSettledOnCurrentSlug || loading),
    isTaken: !!trimmedSlug && isSettledOnCurrentSlug && !loading && !!data?.channel,
  };
};
