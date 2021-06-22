import { ExitFormPromptContext } from "@saleor/components/Form/ExitFormPromptProvider";
import { useContext } from "react";
import useRouter from "use-react-router";

export type UseNavigatorResult = (
  url: string,
  replace?: boolean,
  preserveQs?: boolean
) => void;
function useNavigator(): UseNavigatorResult {
  const {
    location: { search },
    history
  } = useRouter();

  const { shouldBlockNavigation } = useContext(ExitFormPromptContext);

  return (url: string, replace = false, preserveQs = false) => {
    if (shouldBlockNavigation) {
      return;
    }

    const targetUrl = preserveQs ? url + search : url;

    if (replace) {
      history.replace(targetUrl);
    } else {
      history.push(targetUrl);
    }

    window.scrollTo({ behavior: "smooth", top: 0 });
  };
}

export default useNavigator;
