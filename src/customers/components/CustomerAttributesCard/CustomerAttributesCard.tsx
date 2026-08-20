import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { Callout } from "@dashboard/components/Callout/Callout";
import {
  ClickableCustomerType,
  CustomerTypeDisplay,
} from "@dashboard/components/CustomerType/CustomerType";
import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Placeholder } from "@dashboard/components/Placeholder";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { PAGINATE_BY } from "@dashboard/config";
import { customerTypeUrl } from "@dashboard/customerTypes/urls";
import {
  CustomerTypeSortField,
  OrderDirection,
  PermissionEnum,
  useCustomerTypeListQuery,
} from "@dashboard/graphql";
import useDebounce from "@dashboard/hooks/useDebounce";
import useNavigator from "@dashboard/hooks/useNavigator";
import { buttonMessages } from "@dashboard/intl";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import {
  Box,
  Button,
  Dropdown,
  DynamicCombobox,
  List,
  type Option,
  Text,
} from "@saleor/macaw-ui-next";
import { EllipsisVertical } from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages as pageMessages } from "../CustomerDetailsPage/messages";
import { ChangeCustomerTypeDialog } from "../CustomerTypeCard/ChangeCustomerTypeDialog";
import { messages } from "../CustomerTypeCard/messages";

interface CustomerTypeOption {
  id: string;
  name: string;
}

interface CustomerAttributesCardProps {
  children?: ReactNode;
  selectedType: CustomerTypeOption | null;
  /** Currently saved type. Used to skip the confirm dialog when reverting. */
  savedTypeId: string | null;
  disabled: boolean;
  error?: string;
  onChange: (type: CustomerTypeOption) => void;
}

export const CustomerAttributesCard = ({
  children,
  selectedType,
  savedTypeId,
  disabled,
  error,
  onChange,
}: CustomerAttributesCardProps): JSX.Element => {
  const intl = useIntl();
  const navigate = useNavigator();
  const userPermissions = useUserPermissions();
  const canOpenType = hasPermissions(userPermissions ?? [], [
    PermissionEnum.MANAGE_CUSTOMER_TYPES_AND_ATTRIBUTES,
  ]);
  const [search, setSearch] = useState("");
  const [hasOpened, setHasOpened] = useState(false);
  const [isChangingType, setIsChangingType] = useState(false);
  const [pendingType, setPendingType] = useState<CustomerTypeOption | null>(null);
  const { data, loading } = useCustomerTypeListQuery({
    variables: {
      first: PAGINATE_BY,
      search: search || undefined,
      sort: {
        direction: OrderDirection.ASC,
        field: CustomerTypeSortField.NAME,
      },
    },
    skip: !hasOpened,
  });
  const debouncedSearch = useDebounce((query: string) => {
    setSearch(query);
  }, 300);
  const isTypeChangePending = Boolean(
    selectedType?.id && savedTypeId && selectedType.id !== savedTypeId,
  );
  const showPicker = !selectedType || isChangingType || isTypeChangePending || Boolean(error);
  const canChangeType = !disabled && Boolean(selectedType) && !showPicker;
  const showViewType = canOpenType && Boolean(selectedType);
  const showMenu = canChangeType || showViewType;

  const options = useMemo((): Option[] => {
    const types = mapEdgesToItems(data?.customerTypes) ?? [];
    const fromQuery = types.map(type => ({
      label: type.name,
      value: type.id,
    }));

    if (selectedType && !fromQuery.some(option => option.value === selectedType.id)) {
      return [{ label: selectedType.name, value: selectedType.id }, ...fromQuery];
    }

    return fromQuery;
  }, [data?.customerTypes, selectedType]);

  const value: Option | null = selectedType
    ? { label: selectedType.name, value: selectedType.id }
    : null;

  const startChangingType = (): void => {
    setHasOpened(true);
    setIsChangingType(true);
  };

  const applyType = (type: CustomerTypeOption): void => {
    setPendingType(null);
    setIsChangingType(false);
    onChange(type);
  };

  const handleSelect = (option: Option | null): void => {
    if (!option?.value) {
      return;
    }

    const nextType: CustomerTypeOption = { id: option.value, name: option.label };

    if (nextType.id === selectedType?.id) {
      return;
    }

    // Reverting to the saved type restores hidden attributes — no confirm.
    if (savedTypeId && nextType.id === savedTypeId) {
      applyType(nextType);

      return;
    }

    setPendingType(nextType);
  };

  const typeChip = selectedType ? (
    canOpenType ? (
      <ClickableCustomerType
        customerType={selectedType}
        size={3}
        href={customerTypeUrl(selectedType.id)}
        data-test-id="customer-attributes-type"
      />
    ) : (
      <CustomerTypeDisplay
        customerType={selectedType}
        size={3}
        data-test-id="customer-attributes-type"
      />
    )
  ) : null;

  return (
    <DetailSettingsCard
      data-test-id="customer-attributes"
      title={
        <Box display="inline-flex" alignItems="center" gap={2} flexWrap="wrap" minWidth={0}>
          <FormattedMessage {...pageMessages.attributesTitle} />
          {typeChip}
        </Box>
      }
      headerEnd={
        <Box display="flex" alignItems="center" gap={2}>
          {showPicker && selectedType && !disabled && !isTypeChangePending ? (
            <Button
              data-test-id="cancel-change-customer-type"
              variant="secondary"
              onClick={() => setIsChangingType(false)}
            >
              <FormattedMessage {...buttonMessages.cancel} />
            </Button>
          ) : null}
          {showMenu ? (
            <Dropdown>
              <Dropdown.Trigger>
                <Button
                  variant="tertiary"
                  type="button"
                  data-test-id="customer-attributes-menu"
                  icon={
                    <EllipsisVertical
                      size={iconSize.small}
                      strokeWidth={iconStrokeWidthBySize.small}
                    />
                  }
                  title={intl.formatMessage(buttonMessages.moreOptions)}
                />
              </Dropdown.Trigger>
              <Dropdown.Content align="end">
                <List
                  padding={2}
                  borderRadius={4}
                  boxShadow="defaultOverlay"
                  backgroundColor="default1"
                >
                  {canChangeType ? (
                    <Dropdown.Item>
                      <List.Item
                        borderRadius={4}
                        paddingX={1.5}
                        paddingY={2}
                        onClick={startChangingType}
                        data-test-id="change-customer-type"
                      >
                        <Text>
                          <FormattedMessage {...messages.changeDialogConfirm} />
                        </Text>
                      </List.Item>
                    </Dropdown.Item>
                  ) : null}
                  {showViewType && selectedType ? (
                    <Dropdown.Item>
                      <List.Item
                        borderRadius={4}
                        paddingX={1.5}
                        paddingY={2}
                        onClick={() => navigate(customerTypeUrl(selectedType.id))}
                        data-test-id="view-customer-type"
                      >
                        <Text>
                          <FormattedMessage {...messages.viewType} />
                        </Text>
                      </List.Item>
                    </Dropdown.Item>
                  ) : null}
                </List>
              </Dropdown.Content>
            </Dropdown>
          ) : null}
        </Box>
      }
    >
      <Box display="flex" flexDirection="column" gap={4}>
        {showPicker ? (
          <Box display="flex" flexDirection="column" gap={2}>
            <DynamicCombobox
              data-test-id="customer-type-select"
              disabled={disabled}
              error={!!error}
              helperText={error}
              label={intl.formatMessage(messages.label)}
              options={options}
              value={value}
              onChange={handleSelect}
              onInputValueChange={debouncedSearch}
              onFocus={() => setHasOpened(true)}
              loading={loading}
            />
            <Text size={3} color="default2">
              <FormattedMessage {...messages.hint} />
            </Text>
          </Box>
        ) : null}
        {isTypeChangePending ? (
          <Callout
            type="warning"
            data-test-id="customer-type-change-warning"
            title={<FormattedMessage {...messages.pendingChangeTitle} />}
          >
            <FormattedMessage {...messages.pendingChangeDescription} />
          </Callout>
        ) : null}
        {children ??
          (!showPicker ? (
            <Placeholder>
              <FormattedMessage {...messages.emptyAttributes} />
            </Placeholder>
          ) : null)}
      </Box>
      <ChangeCustomerTypeDialog
        open={pendingType !== null}
        typeName={pendingType?.name ?? ""}
        onClose={() => setPendingType(null)}
        onConfirm={() => {
          if (pendingType) {
            applyType(pendingType);
          }
        }}
      />
    </DetailSettingsCard>
  );
};

CustomerAttributesCard.displayName = "CustomerAttributesCard";
