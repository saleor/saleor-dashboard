import useNavigator from "@saleor/hooks/useNavigator";
import React from "react";

import TaxCountriesPage from "../components/TaxCountriesPage";
import { countriesListUrl, taxTabSectionUrl } from "../urls";

interface CountriesListProps {
  id: string;
}

export const CountriesList: React.FC<CountriesListProps> = ({ id }) => {
  const navigate = useNavigator();

  const handleTabChange = (tab: string) => {
    navigate(taxTabSectionUrl(tab));
  };

  const exampleData = [
    { id: "129837", name: "Brazil" },
    { id: "9182739", name: "Andora" }
  ];

  React.useEffect(() => {
    if (id === "undefined" && exampleData) {
      navigate(countriesListUrl(exampleData?.[0].id));
    }
  }, [id, exampleData]);

  return (
    <TaxCountriesPage
      data={exampleData}
      selectedCountryId={id}
      handleTabChange={handleTabChange}
    />
  );
};

export default CountriesList;
