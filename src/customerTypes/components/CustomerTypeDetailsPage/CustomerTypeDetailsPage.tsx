import {
  TopNav,
  TopNavDestinationIcon,
  topNavDestinationMessages,
} from "@dashboard/components/AppLayout/TopNav";
import { type TopNavMenuItem } from "@dashboard/components/AppLayout/TopNav/Menu";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DetailPageContent } from "@dashboard/components/DetailPageContent/DetailPageContent";
import { useDevModeContext } from "@dashboard/components/DevModePanel/hooks";
import Form, { FormDirtyStateSync } from "@dashboard/components/Form";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { type MetadataFormData } from "@dashboard/components/Metadata/types";
import { Savebar } from "@dashboard/components/Savebar";
import { CustomerTypeAttributes } from "@dashboard/customerTypes/components/CustomerTypeAttributes/CustomerTypeAttributes";
import { CustomerTypeDetails } from "@dashboard/customerTypes/components/CustomerTypeDetails/CustomerTypeDetails";
import { defaultGraphiQLQuery } from "@dashboard/customerTypes/queries";
import { customerTypesPath } from "@dashboard/customerTypes/urls";
import { isCustomerTypeUpdateFormPristine } from "@dashboard/customerTypes/utils/customerTypePageForm";
import {
  AttributeTypeEnum,
  type CustomerTypeDetailsFragment,
  type CustomerTypeUpdateErrorFragment,
} from "@dashboard/graphql";
import { useBackLinkWithState } from "@dashboard/hooks/useBackLinkWithState";
import useNavigator from "@dashboard/hooks/useNavigator";
import { GraphqlIcon } from "@dashboard/icons/GraphqlIcon";
import { type ListActions, type ReorderEvent } from "@dashboard/types";
import { type Option } from "@saleor/macaw-ui-next";
import { Star, Trash2 } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import { CustomerTypeDetailsPageLoading } from "./CustomerTypeDetailsPageLoading";
import { messages } from "./messages";
import { CustomerTypeDetailsTitle } from "./Title";

const emptyCustomerTypeAttributes: NonNullable<CustomerTypeDetailsFragment["attributes"]> = [];

export interface CustomerTypeForm extends MetadataFormData {
  name: string;
  slug: string;
  attributes: Option[];
}

interface CustomerTypeDetailsPageProps {
  errors: CustomerTypeUpdateErrorFragment[];
  customerType: CustomerTypeDetailsFragment | undefined;
  disabled: boolean;
  attributeList: ListActions;
  saveButtonBarState: ConfirmButtonTransitionState;
  onAttributeAdd: (type: AttributeTypeEnum) => void;
  onAttributeCreate: (type: AttributeTypeEnum) => void;
  onAttributeReorder: (event: ReorderEvent, type: AttributeTypeEnum) => void;
  onAttributeUnassign: (id: string) => void;
  onDelete: () => void;
  onSetDefault: () => void;
  onShowMetadata: () => void;
  onSubmit: (data: CustomerTypeForm) => void;
}

export const CustomerTypeDetailsPage = (props: CustomerTypeDetailsPageProps) => {
  const {
    disabled,
    errors,
    customerType,
    attributeList,
    saveButtonBarState,
    onAttributeAdd,
    onAttributeCreate,
    onAttributeUnassign,
    onAttributeReorder,
    onDelete,
    onSetDefault,
    onShowMetadata,
    onSubmit,
  } = props;
  const intl = useIntl();
  const navigate = useNavigator();
  const context = useDevModeContext();
  const openPlaygroundURL = useCallback(() => {
    context.setDevModeContent(defaultGraphiQLQuery);
    context.setVariables(`{ "id": "${customerType?.id}" }`);
    context.setDevModeVisibility(true);
  }, [context, customerType?.id]);
  const formInitialData = useMemo<CustomerTypeForm>(
    () => ({
      attributes:
        customerType?.attributes?.map(attribute => ({
          label: attribute.name,
          value: attribute.id,
        })) || [],
      metadata: [],
      name: customerType?.name || "",
      slug: customerType?.slug || "",
      privateMetadata: [],
    }),
    [customerType],
  );
  const checkIfSaveIsDisabled = useCallback(
    (data: CustomerTypeForm) => {
      if (disabled) {
        return true;
      }

      if (!customerType) {
        return true;
      }

      return isCustomerTypeUpdateFormPristine(data, formInitialData);
    },
    [disabled, formInitialData, customerType],
  );
  const customerTypeListBackLink = useBackLinkWithState({
    path: customerTypesPath,
  });
  const isDefault = !!customerType?.isDefault;
  const menuItems = useMemo<TopNavMenuItem[]>(() => {
    const items: TopNavMenuItem[] = [
      {
        label: intl.formatMessage(messages.openGraphiQL),
        onSelect: openPlaygroundURL,
        testId: "graphiql-redirect",
        icon: <GraphqlIcon />,
      },
    ];

    if (customerType && !isDefault) {
      items.push({
        label: intl.formatMessage(messages.setAsDefault),
        onSelect: onSetDefault,
        testId: "set-default-customer-type",
        icon: <Star size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />,
      });
      items.push({
        label: intl.formatMessage(messages.deleteCustomerType),
        onSelect: onDelete,
        testId: "delete-customer-type",
        color: "critical1",
        icon: <Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />,
      });
    }

    return items;
  }, [customerType, intl, isDefault, onDelete, onSetDefault, openPlaygroundURL]);

  if (!customerType) {
    return (
      <CustomerTypeDetailsPageLoading
        customerTypeListBackLink={customerTypeListBackLink}
        onShowMetadata={onShowMetadata}
      />
    );
  }

  return (
    <Form
      key={customerType.id}
      confirmLeave
      initial={formInitialData}
      onSubmit={onSubmit}
      disabled={disabled}
      checkIfSaveIsDisabled={checkIfSaveIsDisabled}
    >
      {({ change, data, isSaveDisabled, submit, triggerChange }) => (
        <>
          <FormDirtyStateSync
            enabled={!!customerType}
            isSaveDisabled={isSaveDisabled}
            triggerChange={triggerChange}
          />
          <DetailPageLayout>
            <TopNav
              href={customerTypeListBackLink}
              hrefIcon={<TopNavDestinationIcon.customerTypes />}
              hrefTitle={intl.formatMessage(topNavDestinationMessages.allCustomerTypes)}
              title={<CustomerTypeDetailsTitle customerType={customerType} loading={disabled} />}
              actionsGap={3}
            >
              <TopNav.MetadataButton
                onClick={onShowMetadata}
                disabled={!customerType}
                data-test-id="show-customer-type-metadata"
                title={intl.formatMessage(messages.editCustomerTypeMetadata)}
              />
              <TopNav.Menu items={menuItems} dataTestId="menu" />
            </TopNav>
            <DetailPageLayout.Content>
              <DetailPageContent>
                <CustomerTypeAttributes
                  attributes={customerType.attributes ?? emptyCustomerTypeAttributes}
                  disabled={disabled}
                  type={AttributeTypeEnum.CUSTOMER_TYPE}
                  onAttributeAssign={onAttributeAdd}
                  onAttributeCreate={onAttributeCreate}
                  onAttributeReorder={(event: ReorderEvent) =>
                    onAttributeReorder(event, AttributeTypeEnum.CUSTOMER_TYPE)
                  }
                  onAttributeUnassign={onAttributeUnassign}
                  {...attributeList}
                />
              </DetailPageContent>
            </DetailPageLayout.Content>
            <DetailPageLayout.RightSidebar paddingTop={6} paddingX={6}>
              <CustomerTypeDetails
                data={data}
                disabled={disabled}
                isDefault={isDefault}
                errors={errors}
                onChange={change}
              />
            </DetailPageLayout.RightSidebar>
            <Savebar>
              {!isDefault ? <Savebar.DeleteButton onClick={onDelete} /> : null}
              <Savebar.Spacer />
              <Savebar.CancelButton onClick={() => navigate(customerTypeListBackLink)} />
              <Savebar.ConfirmButton
                transitionState={saveButtonBarState}
                onClick={submit}
                disabled={isSaveDisabled}
              />
            </Savebar>
          </DetailPageLayout>
        </>
      )}
    </Form>
  );
};

CustomerTypeDetailsPage.displayName = "CustomerTypeDetailsPage";
