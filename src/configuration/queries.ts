import makeQuery from "@saleor/hooks/makeQuery";
import gql from "graphql-tag";

import { SaleorCoreVersion } from "./types/SaleorCoreVersion";

export const saleorCoreVersion = gql`
  query SaleorCoreVersion {
    shop {
      version
    }
  }
`;

export const useSaleorCoreVersion = makeQuery<SaleorCoreVersion, {}>(
  saleorCoreVersion
);
