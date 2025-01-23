import { Location } from "history";
import { useRef } from "react";
import useRouter from "use-react-router";

const compareLocations = (a: Location, b: Location) => {
  return a.pathname === b.pathname && a.search === b.search;
};

export const useRouteChange = (onChange: (location: Location) => void) => {
  const router = useRouter();
  const location = useRef<Location>(router.history.location);
  const listener = useRef<() => void>(null);

  const register = () => {
    if (listener.current) return;

    onChange(router.history.location);

    listener.current = router.history.listen(incomingLocation => {
      if (location.current && compareLocations(location.current, incomingLocation)) return;

      onChange(incomingLocation);
      location.current = incomingLocation;
    });
  };

  return { register };
};
