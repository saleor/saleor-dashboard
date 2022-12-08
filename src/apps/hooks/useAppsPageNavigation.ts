import { appsSection } from "@saleor/apps/urls";
import useNavigator from "@saleor/hooks/useNavigator";
import { useCallback, useMemo } from "react";
import useRouter from "use-react-router";

export type AppPagePathSegment =
  | "webhooks-and-events"
  | "third-party"
  | "saleor-apps";

const defaultTab: AppPagePathSegment = "webhooks-and-events";
const appTypeQueryParam = "type";

export const useAppsPageNavigation = () => {
  const navigate = useNavigator();
  const {
    location: { search },
  } = useRouter();

  const updatePath = useCallback(
    (value: AppPagePathSegment) => {
      const qs = new URLSearchParams({
        [appTypeQueryParam]: value,
      }).toString();

      navigate(`${appsSection}?${qs}`, { replace: true, resetScroll: true });
    },
    [navigate],
  );

  const activeTab: AppPagePathSegment = useMemo(
    () =>
      (new URLSearchParams(search).get(
        appTypeQueryParam,
      ) as AppPagePathSegment) ?? defaultTab,
    [search],
  );

  return {
    updatePath,
    activeTab,
  };
};
