import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import urljoin from "url-join";

type LocationWithState = Location & {
  state?: {
    prevLocation?: Location;
  };
};

const getPreviousUrl = (location: LocationWithState) => {
  if (!location.state?.prevLocation) {
    return null;
  }

  const { pathname, search } = location.state.prevLocation;

  return urljoin(pathname, search);
};

interface UseBackLinkWithState {
  path: string;
}

const getPath = (path: string) => (path.endsWith("/") ? path.substring(0, path.length - 1) : path);

export const useBackLinkWithState = ({ path }: UseBackLinkWithState) => {
  const location = useLocation();
  const [backLink, setBackLink] = useState<string>(path);

  useEffect(() => {
    if (location.state) {
      const previousUrl = getPreviousUrl(location as LocationWithState);

      // Prevent other links from being set as back link
      const isCorrectPath = previousUrl?.includes(getPath(path));

      if (isCorrectPath && previousUrl) {
        setBackLink(previousUrl);
      }
    }
  }, [location, path]);

  return backLink;
};
