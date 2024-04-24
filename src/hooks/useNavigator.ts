import { ExitFormDialogContext } from "@dashboard/components/Form/ExitFormDialogProvider";
import { useContext } from "react";
import { useLocation, useNavigate } from "react-router";

export type UseNavigatorResult = (
  url: string,
  opts?: {
    replace?: boolean;
    preserveQs?: boolean;
    resetScroll?: boolean;
  },
) => void;
function useNavigator(): UseNavigatorResult {
  const navigate = useNavigate();
  const { search } = useLocation();

  const { shouldBlockNavigation } = useContext(ExitFormDialogContext);

  return (
    url: string,
    { replace = false, preserveQs = false, resetScroll = false } = {},
  ) => {
    if (shouldBlockNavigation()) {
      return;
    }

    const targetUrl = preserveQs ? url + search : url;

    if (replace) {
      navigate(targetUrl, {
        replace: true,
      });
    } else {
      navigate(targetUrl);
    }
    if (resetScroll) {
      window.scrollTo({ behavior: "smooth", top: 0 });
    }
  };
}

export default useNavigator;
