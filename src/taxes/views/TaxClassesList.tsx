// @ts-strict-ignore
import {
  TaxClassCreateErrorFragment,
  TaxClassFragment,
  useTaxClassCreateMutation,
  useTaxClassDeleteMutation,
  useTaxClassesListQuery,
  useTaxClassUpdateMutation,
  useTaxCountriesListQuery,
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import createMetadataCreateHandler, {
  CreateMetadataHandlerFunctionResult,
} from "@dashboard/utils/handlers/metadataCreateHandler";
import createMetadataUpdateHandler from "@dashboard/utils/handlers/metadataUpdateHandler";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import React from "react";
import { useIntl } from "react-intl";

import { taxesMessages } from "../messages";
import TaxClassesPage from "../pages/TaxClassesPage";
import { TaxClassesPageFormData } from "../types";
import { taxClassesListUrl, TaxTab, taxTabPath } from "../urls";
import { createTaxClassCreateInput, createTaxClassUpdateInput } from "../utils/data";
import { useTaxUrlRedirect } from "../utils/useTaxUrlRedirect";
import { mapUndefinedCountriesToTaxClasses } from "../utils/utils";

interface TaxClassesListProps {
  id: string | undefined;
}

export const TaxClassesList = ({ id }: TaxClassesListProps) => {
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
      metadata: [],
      privateMetadata: [],
    }),
    [intl],
  );
  const isNewTaxClass = id === "new";
  const [updateMetadata] = useUpdateMetadataMutation({});
  const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation({});
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
  const [taxClassUpdateMutation, taxClassUpdateMutationState] = useTaxClassUpdateMutation({
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
  const [taxClassCreateMutation, taxClassCreateMutationState] = useTaxClassCreateMutation({
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
  const createTaxClass = async (
    data: TaxClassesPageFormData,
  ): Promise<CreateMetadataHandlerFunctionResult<TaxClassCreateErrorFragment>> => {
    const res = await taxClassCreateMutation({
      variables: {
        input: createTaxClassCreateInput(data),
      },
    });
    const taxClassCreate = res?.data?.taxClassCreate;

    return {
      id: taxClassCreate?.taxClass?.id,
      errors: taxClassCreate?.errors,
    };
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
  const updateTaxClass = async (data: TaxClassesPageFormData) => {
    const res = await taxClassUpdateMutation({
      variables: {
        id: data.id,
        input: createTaxClassUpdateInput(data),
      },
    });

    return res?.data?.taxClassUpdate?.errors || [];
  };
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

    const apiTaxClasses = mapEdgesToItems(data?.taxClasses);
    const connectedTaxClasses = isNewTaxClass ? [newTaxClass, ...apiTaxClasses] : apiTaxClasses;
    const taxClasses = mapUndefinedCountriesToTaxClasses(
      countryRatesData.taxCountryConfigurations,
      connectedTaxClasses,
    );

    return taxClasses;
  }, [countryRatesData?.taxCountryConfigurations, data?.taxClasses, isNewTaxClass, newTaxClass]);
  const selectedTaxClass = React.useMemo(() => {
    if (isNewTaxClass) {
      return newTaxClass;
    }

    return taxClasses?.find(taxClass => taxClass.id === id);
  }, [id, isNewTaxClass, newTaxClass, taxClasses]);
  const handleCreateTaxClass = createMetadataCreateHandler(
    createTaxClass,
    updateMetadata,
    updatePrivateMetadata,
    id => {
      refetch();
      navigate(id);
    },
  );
  const handleUpdateTaxClass = createMetadataUpdateHandler(
    selectedTaxClass,
    updateTaxClass,
    variables => updateMetadata({ variables }),
    variables => updatePrivateMetadata({ variables }),
  );
  const savebarState = isNewTaxClass
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
