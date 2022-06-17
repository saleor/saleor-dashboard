import useNavigator from "@saleor/hooks/useNavigator";
import React from "react";

import { taxClasses } from "../fixtures";
import TaxClassesPage from "../pages/TaxClassesPage";
import { taxClassesListUrl, taxTabSectionUrl } from "../urls";
import { useTaxUrlRedirect } from "../utils/useTaxUrlRedirect";

interface TaxClassesListProps {
  id: string | undefined;
}

export const TaxClassesList: React.FC<TaxClassesListProps> = ({ id }) => {
  const navigate = useNavigator();

  const handleTabChange = (tab: string) => {
    navigate(taxTabSectionUrl(tab));
  };

  useTaxUrlRedirect({
    id,
    data: taxClasses,
    navigate,
    urlFunction: taxClassesListUrl
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
