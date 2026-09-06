import { ExitFormDialogContext } from "@dashboard/components/Form/ExitFormDialogProvider";
import { useContext } from "react";
import { useHistory, useLocation } from "react-router";

export type NavigatorOpts = {
  replace?: boolean;
  preserveQs?: boolean;
  resetScroll?: boolean;
  state?: Record<string, unknown>;
};

export type UseNavigatorResult = (url: string, opts?: NavigatorOpts) => void;
function useNavigator(): UseNavigatorResult {
  const { search } = useLocation();
  const history = useHistory();
  const { shouldBlockNavigation } = useContext(ExitFormDialogContext);

  return (
    url: string,
    { replace = false, preserveQs = false, resetScroll = false, state } = {},
  ) => {
    if (shouldBlockNavigation()) {
      return;
    }

    const targetUrl = preserveQs ? url + search : url;

    if (replace) {
      history.replace(targetUrl, state);
    } else {
      history.push(targetUrl, state);
    }

    if (resetScroll) {
      window.scrollTo({ behavior: "smooth", top: 0 });
    }
  };
}

export default useNavigator;
