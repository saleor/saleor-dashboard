import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import {
  type ChannelFromOrder,
  extractChannelsFromOrders,
} from "@dashboard/customers/components/CustomerOverview/utils";
import { useRegisterEntityRefresh } from "@dashboard/extensions/entity-refresh";
import {
  type CustomerDetailsQuery,
  PermissionEnum,
  useCustomerDetailsQuery,
} from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { createContext, type ReactNode, useCallback, useEffect, useMemo, useState } from "react";

interface CustomerDetailsProviderProps {
  id: string;
}

interface CustomerDetailsConsumerProps {
  customer: CustomerDetailsQuery | null;
  loading: boolean | null;
  kpiChannelId: string | undefined;
  setKpiChannelId: (channelId: string | undefined) => void;
  kpiChannels: ChannelFromOrder[];
  effectiveKpiChannelId: string | undefined;
}

export const CustomerDetailsContext = createContext<CustomerDetailsConsumerProps | null>(null);

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

  const {
    data: bootstrapData,
    loading: bootstrapLoading,
    refetch: refetchBootstrap,
  } = useCustomerDetailsQuery({
    displayLoader: true,
    variables: {
      id,
      kpiChannelId: "",
      includeKpiOrderCount: false,
    },
  });

  const kpiChannels = useMemo(() => {
    const orders = mapEdgesToItems(bootstrapData?.user?.kpiOrderChannels) ?? [];

    return extractChannelsFromOrders(orders);
  }, [bootstrapData?.user?.kpiOrderChannels]);

  const effectiveKpiChannelId = kpiChannelId ?? kpiChannels[0]?.id;
  const shouldFetchScopedKpis = Boolean(effectiveKpiChannelId) && hasManageOrders;

  useEffect(
    function selectDefaultKpiChannel() {
      if (!kpiChannelId && kpiChannels[0]) {
        setKpiChannelId(kpiChannels[0].id);
      }
    },
    [kpiChannelId, kpiChannels, setKpiChannelId],
  );

  const {
    data: scopedData,
    loading: scopedLoading,
    refetch: refetchScoped,
  } = useCustomerDetailsQuery({
    displayLoader: true,
    skip: !shouldFetchScopedKpis,
    variables: {
      id,
      kpiChannelId: effectiveKpiChannelId ?? "",
      includeKpiOrderCount: true,
    },
  });

  const customer = scopedData ?? bootstrapData ?? null;
  const loading = bootstrapLoading || (shouldFetchScopedKpis && scopedLoading);

  const refetch = useCallback(async () => {
    await refetchBootstrap();

    if (shouldFetchScopedKpis) {
      await refetchScoped();
    }
  }, [refetchBootstrap, refetchScoped, shouldFetchScopedKpis]);

  useRegisterEntityRefresh(refetch);

  const providerValues: CustomerDetailsConsumerProps = useMemo(
    () => ({
      customer,
      effectiveKpiChannelId,
      kpiChannelId,
      kpiChannels,
      loading,
      setKpiChannelId,
    }),
    [customer, effectiveKpiChannelId, kpiChannelId, kpiChannels, loading, setKpiChannelId],
  );

  return (
    <CustomerDetailsContext.Provider value={providerValues}>
      {children}
    </CustomerDetailsContext.Provider>
  );
};
