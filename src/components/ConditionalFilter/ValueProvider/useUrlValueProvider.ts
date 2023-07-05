// @ts-strict-ignore

import { stringify } from "qs";
import useRouter from "use-react-router";

import { useInitialAPIState } from "../API/initialState/useInitalAPIState";
import { FilterContainer } from "../FilterElement";
import { FilterValueProvider } from "../FilterValueProvider";
import { useTokenArray } from "./TokenArray";

const prepareStructure = filterValue =>
  filterValue.map(f => {
    if (typeof f === "string") {
      return f;
    }

    if (Array.isArray(f)) {
      return prepareStructure(f);
    }

    return f.asUrlEntry();
  });

/*
  exampple url: http://localhost:9000/dashboard/products/?0%5Bs2.category%5D%5B0%5D=accessories&0%5Bs2.category%5D%5B1%5D=groceries&1=o&2%5Ba2.abv%5D%5B0%5D=QXR0cmlidXRlVmFsdWU6Njg%3D&3=a&4%5Bs2.collection%5D%5B0%5D=featured-products&5=a&6%5Bs2.producttype%5D%5B0%5D=beer&7=a&8%5B0%5D%5Bs2.category%5D%5B0%5D=apparel&8%5B1%5D=o&8%5B2%5D%5Ba2.bottle-size%5D%5B0%5D=QXR0cmlidXRlVmFsdWU6NDY%3D&8%5B2%5D%5Ba2.bottle-size%5D%5B1%5D=QXR0cmlidXRlVmFsdWU6NDc%3D&asc=true&sort=name
*/
export const useUrlValueProvider = (): FilterValueProvider => {
  const router = useRouter();
  const params = new URLSearchParams(router.location.search);
  params.delete("asc");
  params.delete("sort");

  const tokenizedUrl = useTokenArray(params.toString());
  const fetchingParams = tokenizedUrl.getFetchingParams();
  const { data, loading } = useInitialAPIState(fetchingParams);
  const value = loading ? [] : tokenizedUrl.asFilterValuesFromResponse(data);

  const persist = (filterValue: FilterContainer) => {
    router.history.replace({
      pathname: router.location.pathname,
      search: stringify(prepareStructure(filterValue)),
    });
  };

  return {
    value,
    loading,
    persist,
  };
};
