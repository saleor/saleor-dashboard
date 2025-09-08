import AssignReferenceTypesDialog from "@dashboard/attributes/components/AssignReferenceTypesDialog";
import { attributeListPath } from "@dashboard/attributes/urls";
import { ATTRIBUTE_TYPES_WITH_DEDICATED_VALUES } from "@dashboard/attributes/utils/data";
import { useUser } from "@dashboard/auth";
import { hasPermission } from "@dashboard/auth/misc";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Metadata } from "@dashboard/components/Metadata/Metadata";
import { MetadataFormData } from "@dashboard/components/Metadata/types";
import { Savebar } from "@dashboard/components/Savebar";
import { ListSettingsUpdate } from "@dashboard/components/TablePagination";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import {
  AttributeDetailsFragment,
  AttributeDetailsQuery,
  AttributeEntityTypeEnum,
  AttributeErrorFragment,
  AttributeInputTypeEnum,
  AttributeTypeEnum,
  MeasurementUnitsEnum,
  PermissionEnum,
} from "@dashboard/graphql";
import { getSearchFetchMoreProps } from "@dashboard/hooks/makeTopLevelSearch/utils";
import { useBackLinkWithState } from "@dashboard/hooks/useBackLinkWithState";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import useReferenceTypeSearch from "@dashboard/searches/useReferenceTypeSearch";
import { TranslationsButton } from "@dashboard/translations/components/TranslationsButton/TranslationsButton";
import { languageEntityUrl, TranslatableEntities } from "@dashboard/translations/urls";
import { useCachedLocales } from "@dashboard/translations/useCachedLocales";
import { ListSettings, ReorderAction } from "@dashboard/types";
import { mapEdgesToItems, mapMetadataItemToInput } from "@dashboard/utils/maps";
import useMetadataChangeTrigger from "@dashboard/utils/metadata/useMetadataChangeTrigger";
import React from "react";
import { useIntl } from "react-intl";
import slugify from "slugify";

import AttributeDetails from "../AttributeDetails";
import AttributeOrganization from "../AttributeOrganization";
import AttributeProperties from "../AttributeProperties";
import AttributeReferenceTypesSection from "../AttributeReferenceTypesSection";
import AttributeValues from "../AttributeValues";

export interface AttributePageProps {
  attribute?: AttributeDetailsFragment | null | undefined;
  disabled: boolean;
  errors: AttributeErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  values?: NonNullable<AttributeDetailsQuery["attribute"]>["choices"] | undefined;
  onDelete: () => void;
  onSubmit: (data: AttributePageFormData) => SubmitPromise;
  onValueAdd: () => void;
  onValueDelete: (id: string) => void;
  onValueReorder: ReorderAction;
  onValueUpdate: (id: string) => void;
  settings?: ListSettings;
  onUpdateListSettings?: ListSettingsUpdate;
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  onNextPage: () => void;
  onPreviousPage: () => void;
  children: (data: AttributePageFormData) => React.ReactNode;
}

export interface AttributePageFormData extends MetadataFormData {
  type?: AttributeTypeEnum;
  availableInGrid: boolean;
  filterableInDashboard: boolean;
  inputType: AttributeInputTypeEnum;
  entityType: AttributeEntityTypeEnum | null;
  filterableInStorefront: boolean;
  name: string;
  slug: string;
  storefrontSearchPosition: string;
  valueRequired: boolean;
  unit: MeasurementUnitsEnum | null | undefined;
  visibleInStorefront: boolean;
  referenceTypes: Array<string>; // later only value
}

const AttributePage = ({
  attribute,
  disabled,
  errors: apiErrors,
  saveButtonBarState,
  values,
  onDelete,
  onSubmit,
  onValueAdd,
  onValueDelete,
  onValueReorder,
  onValueUpdate,
  settings,
  onUpdateListSettings,
  pageInfo,
  onNextPage,
  onPreviousPage,
  children,
}: AttributePageProps) => {
  const intl = useIntl();
  const { lastUsedLocaleOrFallback } = useCachedLocales();
  const { user } = useUser();
  const canTranslate = user && hasPermission(PermissionEnum.MANAGE_TRANSLATIONS, user);
  const navigate = useNavigator();
  const { makeChangeHandler: makeMetadataChangeHandler } = useMetadataChangeTrigger();
  const initialForm: AttributePageFormData = !attribute
    ? {
        availableInGrid: true,
        entityType: null,
        filterableInDashboard: true,
        filterableInStorefront: true,
        inputType: AttributeInputTypeEnum.DROPDOWN,
        metadata: [],
        name: "",
        privateMetadata: [],
        slug: "",
        storefrontSearchPosition: "",
        type: AttributeTypeEnum.PRODUCT_TYPE,
        valueRequired: true,
        visibleInStorefront: true,
        unit: undefined,
        referenceTypes: [],
      }
    : {
        availableInGrid: attribute.availableInGrid,
        entityType: attribute.entityType,
        filterableInDashboard: attribute.filterableInDashboard,
        filterableInStorefront: attribute.filterableInStorefront,
        inputType: attribute?.inputType ?? AttributeInputTypeEnum.DROPDOWN,
        metadata: attribute.metadata.map(mapMetadataItemToInput),
        name: attribute?.name ?? "",
        privateMetadata: attribute.privateMetadata.map(mapMetadataItemToInput),
        slug: attribute?.slug ?? "",
        storefrontSearchPosition: attribute.storefrontSearchPosition.toString(),
        type: attribute?.type ?? AttributeTypeEnum.PRODUCT_TYPE,
        valueRequired: !!attribute.valueRequired,
        visibleInStorefront: attribute.visibleInStorefront,
        unit: attribute?.unit ?? null,
        referenceTypes: attribute?.referenceTypes.map(ref => ref.id) || [],
      };
  const handleSubmit = (data: AttributePageFormData) => {
    const type = attribute === null ? data.type : undefined;

    return onSubmit({
      ...data,
      slug: data.slug || slugify(data.name).toLowerCase(),
      type,
    });
  };

  const attributePageBackLink = useBackLinkWithState({
    path: attributeListPath,
  });
  const [isAssignRefTypesOpen, setAssignRefTypesOpen] = React.useState(false);
  // useReferenceTypeSearch - cannot be hook, as it depends on 
  const {
    loadMore: loadMoreReferenceTypes,
    search: searchReferenceTypes,
    result: searchReferenceTypesOpts,
  } = useReferenceTypeSearch(
    attribute?.entityType,
    {variables: DEFAULT_INITIAL_SEARCH_DATA},
  );
  const referenceTypes = mapEdgesToItems<{ id: string; name: string }>(
    searchReferenceTypesOpts.data?.search,
  );
  const fetchMoreReferenceTypes = getSearchFetchMoreProps(
    searchReferenceTypesOpts,
    loadMoreReferenceTypes,
  );

  return (
    <Form confirmLeave initial={initialForm} onSubmit={handleSubmit} disabled={disabled}>
      {({ change, set, data, isSaveDisabled, submit, errors, setError, clearErrors }) => {
        const changeMetadata = makeMetadataChangeHandler(change);
        const setReferenceTypes = (selected: Array<{ id: string; name: string }>) => {
          const existingIds = new Set(data.referenceTypes);
          const newReferenceTypes = selected
            .filter(ref => !existingIds.has(ref.id))
            .map(ref => ref.id);

          set({ referenceTypes: [...data.referenceTypes, ...newReferenceTypes] });
          setAssignRefTypesOpen(false);
        };
        const handleRemoveReferenceType = (id: string) => {
          set({ referenceTypes: data.referenceTypes.filter(ref => ref !== id) });
        };
        const getSelectedReferenceTypes = () => {
          return data.referenceTypes.map(id => {
            const reference = referenceTypes?.find(ref => ref.id === id);

            return { label: reference?.name || id, value: id };
          });
        };

        return (
          <>
            <DetailPageLayout>
              <TopNav
                href={attributePageBackLink}
                title={
                  attribute === null
                    ? intl.formatMessage({
                        id: "8cUEPV",
                        defaultMessage: "Create New Attribute",
                        description: "page title",
                      })
                    : attribute?.name
                }
              >
                {canTranslate && (
                  <TranslationsButton
                    onClick={() =>
                      navigate(
                        languageEntityUrl(
                          lastUsedLocaleOrFallback,
                          TranslatableEntities.attributes,
                          attribute?.id ?? "",
                        ),
                      )
                    }
                  />
                )}
              </TopNav>
              <DetailPageLayout.Content>
                <AttributeDetails
                  canChangeType={attribute === null}
                  data={data}
                  disabled={disabled}
                  apiErrors={apiErrors}
                  onChange={change}
                  set={set}
                  errors={errors}
                  setError={setError}
                  clearErrors={clearErrors}
                />
                  <CardSpacer />
                <AttributeReferenceTypesSection
                  inputType={data.inputType}
                  entityType={data.entityType}
                  selectedTypes={getSelectedReferenceTypes()}
                  disabled={disabled}
                  onAssignClick={() => setAssignRefTypesOpen(true)}
                  onRemoveType={handleRemoveReferenceType}
                />
                {ATTRIBUTE_TYPES_WITH_DEDICATED_VALUES.includes(data.inputType) && (
                  <>
                    <AttributeValues
                      inputType={data.inputType}
                      disabled={disabled}
                      values={mapEdgesToItems(values)}
                      onValueAdd={onValueAdd}
                      onValueDelete={onValueDelete}
                      onValueReorder={onValueReorder}
                      onValueUpdate={onValueUpdate}
                      settings={settings}
                      onUpdateListSettings={onUpdateListSettings}
                      pageInfo={pageInfo}
                      onNextPage={onNextPage}
                      onPreviousPage={onPreviousPage}
                    />
                  </>
                )}
                <Metadata data={data} isLoading={disabled} onChange={changeMetadata} />
              </DetailPageLayout.Content>
              <DetailPageLayout.RightSidebar>
                <AttributeOrganization
                  canChangeType={attribute === null}
                  data={data}
                  disabled={disabled}
                  onChange={change}
                />
                <CardSpacer />
                <AttributeProperties
                  data={data}
                  errors={apiErrors}
                  disabled={disabled}
                  onChange={change}
                />
              </DetailPageLayout.RightSidebar>
              <Savebar>
                {attribute !== null && <Savebar.DeleteButton onClick={onDelete} />}
                <Savebar.Spacer />
                <Savebar.CancelButton onClick={() => navigate(attributePageBackLink)} />
                <Savebar.ConfirmButton
                  transitionState={saveButtonBarState}
                  onClick={submit}
                  disabled={!!isSaveDisabled}
                />
              </Savebar>
            </DetailPageLayout>
            <AssignReferenceTypesDialog
              key={data.referenceTypes.map(o => o.value).sort().join("|")}
              // docelowo sterowane URLem
              open={isAssignRefTypesOpen}
              // tak samo jak wyzej
              onClose={() => setAssignRefTypesOpen(false)}
              confirmButtonState={"default"}
              loading={Boolean(fetchMoreReferenceTypes?.loading)}
              selectedReferenceTypesIds={data.referenceTypes.map(o => o.value)}
              referenceTypes={(referenceTypes ?? []).map(pt => ({ id: pt.id, name: pt.name }))}
              hasMore={fetchMoreReferenceTypes?.hasMore}
              onFetchMore={fetchMoreReferenceTypes?.onFetchMore}
              onFetch={searchReferenceTypes}
              onSubmit={setReferenceTypes}
            />
            {children(data)}
          </>
        );
      }}
    </Form>
  );
};

AttributePage.displayName = "AttributePage";
export default AttributePage;
