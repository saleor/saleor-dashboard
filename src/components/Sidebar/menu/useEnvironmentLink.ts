import { useCloud } from "@dashboard/auth/hooks/useCloud";

export const useEnvironmentLink = () => {
  const { isCloudInstance, isAuthenticatedViaCloud } = useCloud();

  return {
    canRender: isCloudInstance && isAuthenticatedViaCloud,
  };
};
