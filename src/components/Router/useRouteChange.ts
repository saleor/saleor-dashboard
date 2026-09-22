import { type Location, type UnregisterCallback } from "history";
import { useRef } from "react";
import { useHistory } from "react-router";

const compareLocations = (a: Location, b: Location) => {
  return a.pathname === b.pathname && a.search === b.search;
};

export const useRouteChange = (onChange: (location: Location) => void) => {
  const history = useHistory();
  const location = useRef<Location>(history.location);
  const listener = useRef<UnregisterCallback | null>(null);

  const register = () => {
    if (listener.current) return;

    onChange(history.location);

    listener.current = history.listen(incomingLocation => {
      if (location.current && compareLocations(location.current, incomingLocation)) return;

      onChange(incomingLocation);
      location.current = incomingLocation;
    });
  };

  return { register };
};
