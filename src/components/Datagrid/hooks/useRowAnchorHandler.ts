import useNavigator, { NavigatorOpts } from "@dashboard/hooks/useNavigator";
import { MouseEvent } from "react";

export const useRowAnchorHandler = (navigatorOpts?: NavigatorOpts) => {
  const navigate = useNavigator();

  return (e: MouseEvent<HTMLAnchorElement>) => {
    // When someone clicks with CMD key to open in new tab, we should not prevent default
    if (e.metaKey || e.ctrlKey) {
      return;
    }

    // Prevent default when navigate with browser router
    e.preventDefault();

    if (e.currentTarget.dataset.reactRouterPath) {
      // Navigate gets only a path to navigate, for example, /products/1
      // Navigate use browser router and cover case when url is with /dashboard or not
      navigate(e.currentTarget.dataset.reactRouterPath, navigatorOpts);
    }
  };
};
