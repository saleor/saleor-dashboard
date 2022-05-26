/**
 * This is a url to the tax page: /taxes/channels/{taxConfigurationId}
 * However, when we load the page for the first time we don't know
 * the first taxConfigurationId, we need to query it first. So this hook
 * redirects from generic url (/taxes/channels/) to the one with id.
 * Its use is similar in countries and taxes views
 */

import { UseNavigatorResult } from "@saleor/hooks/useNavigator";
import React from "react";

interface TaxEntity {
  id: string;
}

interface UseTaxUrlRedirectOpts {
  id: string;
  data: TaxEntity[];
  navigate: UseNavigatorResult;
  urlFunction: (id: string) => string;
}

export function useTaxUrlRedirect({
  id,
  data,
  navigate,
  urlFunction
}: UseTaxUrlRedirectOpts): void {
  React.useEffect(() => {
    if (id === "undefined" && data) {
      navigate(urlFunction(data[0].id));
    }
  }, [id, data]);
}
