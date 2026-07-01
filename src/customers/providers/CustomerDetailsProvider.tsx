// @ts-strict-ignore
import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { useRegisterEntityRefresh } from "@dashboard/extensions/entity-refresh";
import {
  type CustomerDetailsQuery,
  PermissionEnum,
  useCustomerDetailsQuery,
} from "@dashboard/graphql";
import { createContext, type ReactNode, useCallback, useMemo, useState } from "react";

interface CustomerDetailsProviderProps {
  id: string;
}

interface CustomerDetailsConsumerProps {
  customer: CustomerDetailsQuery | null;
  loading: boolean | null;
  kpiChannelId: string | undefined;
  setKpiChannelId: (channelId: string | undefined) => void;
}

export const CustomerDetailsContext = createContext<CustomerDetailsConsumerProps>(null);

export const CustomerDetailsProvider = ({
  children,
  id,
}: CustomerDetailsProviderProps & { children: ReactNode }) => {
  const [kpiChannelId, setKpiChannelIdState] = useState<string | undefined>(undefined);

  const setKpiChannelId = useCallback((channelId: string | undefined) => {
    setKpiChannelIdState(channelId);
  }, []);

  const userPermissions = useUserPermissions();
  const hasManageOrders = hasPermissions(userPermissions ?? [], [PermissionEnum.MANAGE_ORDERS]);
  const includeKpiOrderCount = Boolean(kpiChannelId) && hasManageOrders;

  const { data, loading, refetch } = useCustomerDetailsQuery({
    displayLoader: true,
    variables: {
      id,
      kpiChannelId: kpiChannelId ?? "",
      includeKpiOrderCount,
    },
  });

  useRegisterEntityRefresh(refetch);

  const providerValues: CustomerDetailsConsumerProps = useMemo(
    () => ({
      customer: data,
      kpiChannelId,
      loading,
      setKpiChannelId,
    }),
    [data, kpiChannelId, loading, setKpiChannelId],
  );

  return (
    <CustomerDetailsContext.Provider value={providerValues}>
      {children}
    </CustomerDetailsContext.Provider>
  );
};
