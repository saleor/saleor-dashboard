import { useTaxClassesListQuery } from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import { mapEdgesToItems } from "@saleor/utils/maps";
import React from "react";

import TaxClassesPage from "../pages/TaxClassesPage";
import { taxClassesListUrl, TaxTab, taxTabPath } from "../urls";
import { useTaxUrlRedirect } from "../utils/useTaxUrlRedirect";

interface TaxClassesListProps {
  id: string | undefined;
}

export const TaxClassesList: React.FC<TaxClassesListProps> = ({ id }) => {
  const navigate = useNavigator();

  const handleTabChange = (tab: TaxTab) => {
    navigate(taxTabPath(tab));
  };

  const { data } = useTaxClassesListQuery({ variables: { first: 20 } });
  const taxClasses = mapEdgesToItems(data?.taxClasses);

  useTaxUrlRedirect({
    id,
    data: taxClasses,
    navigate,
    urlFunction: taxClassesListUrl,
  });

  if (id === "undefined" && taxClasses) {
    return null;
  }

  return (
    <TaxClassesPage
      taxClasses={taxClasses}
      handleTabChange={handleTabChange}
      selectedTaxClassId={id}
    />
  );
};

export default TaxClassesList;
