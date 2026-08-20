import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { Callout } from "@dashboard/components/Callout/Callout";
import { DashboardCard } from "@dashboard/components/Card";
import { MicrocopyLink } from "@dashboard/components/MicrocopyLink";
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
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Box, DynamicCombobox, type Option } from "@saleor/macaw-ui-next";
import { useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ChangeCustomerTypeDialog } from "./ChangeCustomerTypeDialog";
import { messages } from "./messages";

interface CustomerTypeOption {
  id: string;
  name: string;
}

interface CustomerTypeCardProps {
  selectedType: CustomerTypeOption | null;
  /** Currently saved type. Used to skip the confirm dialog when reverting. */
  savedTypeId: string | null;
  disabled: boolean;
  error?: string;
  onChange: (type: CustomerTypeOption) => void;
}

export const CustomerTypeCard = ({
  selectedType,
  savedTypeId,
  disabled,
  error,
  onChange,
}: CustomerTypeCardProps): JSX.Element => {
  const intl = useIntl();
  const userPermissions = useUserPermissions();
  const canOpenType = hasPermissions(userPermissions ?? [], [
    PermissionEnum.MANAGE_CUSTOMER_TYPES_AND_ATTRIBUTES,
  ]);
  const [search, setSearch] = useState("");
  const [hasOpened, setHasOpened] = useState(false);
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

  const applyType = (type: CustomerTypeOption): void => {
    setPendingType(null);
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

  return (
    <DashboardCard data-test-id="customer-type">
      <DashboardCard.Header>
        <Box display="flex" flexDirection="column" gap={1}>
          <DashboardCard.Title size={6} fontWeight="medium">
            <FormattedMessage {...messages.title} />
          </DashboardCard.Title>
          <DashboardCard.Subtitle fontSize={3} color="default2">
            <FormattedMessage {...messages.hint} />
          </DashboardCard.Subtitle>
        </Box>
      </DashboardCard.Header>
      <DashboardCard.Content>
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
          {isTypeChangePending ? (
            <Callout
              type="warning"
              data-test-id="customer-type-change-warning"
              title={<FormattedMessage {...messages.pendingChangeTitle} />}
            >
              <FormattedMessage {...messages.pendingChangeDescription} />
            </Callout>
          ) : null}
          {canOpenType && selectedType ? (
            <DashboardCard.Subtitle fontSize={3} color="default2">
              <MicrocopyLink to={customerTypeUrl(selectedType.id)}>
                <FormattedMessage {...messages.viewType} />
              </MicrocopyLink>
            </DashboardCard.Subtitle>
          ) : null}
        </Box>
      </DashboardCard.Content>
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
    </DashboardCard>
  );
};

CustomerTypeCard.displayName = "CustomerTypeCard";
