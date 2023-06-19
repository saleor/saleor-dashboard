import useRouter from "use-react-router";

import { useInitialAPIState } from "../API/getInitalAPIState";
import { FilterElement } from "../FilterElement";
import { FilterValueProvider } from "../FilterValueProvider";
import { obtainFetchingParams } from "./fetchingParams";
import { TokenArray, tokenizeUrl } from "./tokenize";

const mapUrlTokensToFilterValues = (urlTokens: TokenArray, response: any) =>
  urlTokens.map(el => {
    if (typeof el === "string") {
      return el;
    }

    if (Array.isArray(el)) {
      return mapUrlTokensToFilterValues(el, response);
    }

    return FilterElement.fromUrlToken(el, response);
  });

export const useUrlValueProvider = (): FilterValueProvider => {
  const router = useRouter();
  const tokenizedUrl = tokenizeUrl(
    "0%5Bs2.category%5D%5B0%5D=accessories&0%5Bs2.category%5D%5B1%5D=groceries&1=o&2%5Ba2.abv%5D%5B0%5D=QXR0cmlidXRlVmFsdWU6Njg%3D&3=a&4%5Bs2.collection%5D%5B0%5D=featured-products&5=a&6%5Bs2.producttype%5D%5B0%5D=beer&7=a&8%5B0%5D%5Bs2.category%5D%5B0%5D=apparel&8%5B1%5D=o&8%5B2%5D%5Ba2.bottle-size%5D%5B0%5D=QXR0cmlidXRlVmFsdWU6NDY%3D&8%5B2%5D%5Ba2.bottle-size%5D%5B1%5D=QXR0cmlidXRlVmFsdWU6NDc%3D",
  );
  const fetchingParams = obtainFetchingParams(tokenizedUrl);
  const { data, loading } = useInitialAPIState(fetchingParams);
  const value = loading ? [] : mapUrlTokensToFilterValues(tokenizedUrl, data)


  
  const persist = (filterValue: Array<string | FilterElement>) => {
    // const search = createFiltersUrl(filterValue)
    // router.history.replace({
    //   pathname: router.location.pathname,
    //   search
    // })
  };

  // let result = [];

  // console.log("tokenized", tokenizedUrl);
  // console.log("flatenated", fetchingParams);


  return {
    value,
    loading,
    persist,
  };
};
