import {
  TaxClassCreateInput,
  TaxClassFragment,
  TaxClassUpdateInput,
  useTaxClassCreateMutation,
  useTaxClassDeleteMutation,
  useTaxClassesListQuery,
  useTaxClassUpdateMutation,
  useTaxCountriesListQuery,
} from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import { mapEdgesToItems } from "@saleor/utils/maps";
import React from "react";
import { useIntl } from "react-intl";

import { taxesMessages } from "../messages";
import TaxClassesPage from "../pages/TaxClassesPage";
import { taxClassesListUrl, TaxTab, taxTabPath } from "../urls";
import { useTaxUrlRedirect } from "../utils/useTaxUrlRedirect";
import { mapUndefinedCountriesToTaxClasses } from "../utils/utils";

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

  const newTaxClass: TaxClassFragment = React.useMemo(
    () => ({
      __typename: "TaxClass" as const,
      id: "new",
      name: intl.formatMessage(taxesMessages.newTaxClass),
      countries: [],
    }),
    [intl],
  );

  const isNewTaxClass = id === "new";

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

  const [
    taxClassUpdateMutation,
    taxClassUpdateMutationState,
  ] = useTaxClassUpdateMutation({
    onCompleted: data => {
      const errors = data?.taxClassUpdate?.errors;
      if (errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
      }
    },
  });

  const [
    taxClassCreateMutation,
    taxClassCreateMutationState,
  ] = useTaxClassCreateMutation({
    onCompleted: data => {
      const errors = data?.taxClassCreate?.errors;
      if (errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
        navigate(taxClassesListUrl(data?.taxClassCreate?.taxClass?.id));
      }
    },
  });

  const handleCreateTaxClass = async (input: TaxClassCreateInput) => {
    const res = await taxClassCreateMutation({
      variables: {
        input,
      },
    });
    refetch();
    navigate(res?.data?.taxClassCreate?.taxClass?.id);
    return res;
  };

  const handleDeleteTaxClass = async (id: string) => {
    if (isNewTaxClass) {
      navigate(taxClassesListUrl());
    } else {
      await taxClassDeleteMutation({
        variables: {
          id,
        },
      });
      refetch();
      navigate(taxClassesListUrl());
    }
  };

  const handleUpdateTaxClass = async (id: string, input: TaxClassUpdateInput) =>
    taxClassUpdateMutation({
      variables: {
        id,
        input,
      },
    });

  const { data, refetch } = useTaxClassesListQuery({
    variables: { first: 100 },
  });
  const { data: countryRatesData } = useTaxCountriesListQuery();

  const taxClasses = React.useMemo(() => {
    if (
      data?.taxClasses === undefined ||
      countryRatesData?.taxCountryConfigurations === undefined
    ) {
      return undefined;
    }
    const apiTaxClasses = mapUndefinedCountriesToTaxClasses(
      countryRatesData.taxCountryConfigurations,
      mapEdgesToItems(data.taxClasses),
    );
    if (!apiTaxClasses.length && !isNewTaxClass) {
      return [];
    }
    if (isNewTaxClass) {
      return [newTaxClass, ...apiTaxClasses];
    }
    return apiTaxClasses;
  }, [
    countryRatesData?.taxCountryConfigurations,
    data?.taxClasses,
    isNewTaxClass,
    newTaxClass,
  ]);

  const savebarState =
    id === "new"
      ? taxClassCreateMutationState.status
      : taxClassUpdateMutationState.status;

  useTaxUrlRedirect({
    id,
    data: taxClasses,
    navigate,
    urlFunction: taxClassesListUrl,
  });

  return (
    <TaxClassesPage
      taxClasses={taxClasses}
      handleTabChange={handleTabChange}
      selectedTaxClassId={id}
      savebarState={savebarState}
      disabled={false}
      onCreateNewButtonClick={() => {
        navigate(taxClassesListUrl("new"));
      }}
      onTaxClassCreate={handleCreateTaxClass}
      onTaxClassUpdate={handleUpdateTaxClass}
      onTaxClassDelete={handleDeleteTaxClass}
    />
  );
};

export default TaxClassesList;
