import * as React from "react";

const getOnLineStatus = (navigator: Navigator) =>
  typeof navigator !== "undefined" && typeof navigator.onLine === "boolean"
    ? navigator.onLine
    : true;

export const useNavigatorOnline = (navigator: Navigator) => {
  const [status, setStatus] = React.useState(getOnLineStatus(navigator));

  const setOnline = () => setStatus(true);
  const setOffline = () => setStatus(false);

  React.useEffect(() => {
    window.addEventListener("online", setOnline);
    window.addEventListener("offline", setOffline);

    return () => {
      window.removeEventListener("online", setOnline);
      window.removeEventListener("offline", setOffline);
    };
  }, []);

  return status;
};
