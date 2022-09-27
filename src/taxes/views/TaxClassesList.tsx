import {
  useTaxClassDeleteMutation,
  useTaxClassesListQuery,
} from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import { mapEdgesToItems } from "@saleor/utils/maps";
import React from "react";
import { useIntl } from "react-intl";

import TaxClassesPage from "../pages/TaxClassesPage";
import { taxClassesListUrl, TaxTab, taxTabPath } from "../urls";
import { useTaxUrlRedirect } from "../utils/useTaxUrlRedirect";

interface TaxClassesListProps {
  id: string | undefined;
}

export const TaxClassesList: React.FC<TaxClassesListProps> = ({ id }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const handleTabChange = (tab: TaxTab) => {
    navigate(taxTabPath(tab));
  };

  const [taxClassDeleteMutation] = useTaxClassDeleteMutation({
    onCompleted: data => {
      const errors = data?.taxClassDelete?.errors;
      if (errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
      }
    },
  });

  const handleDeleteTaxClass = async (id: string) =>
    taxClassDeleteMutation({
      variables: {
        id,
      },
    });

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
      savebarState={"default"}
      disabled={false}
      onSubmit={() => null}
      onTaxClassDelete={handleDeleteTaxClass}
    />
  );
};

export default TaxClassesList;
