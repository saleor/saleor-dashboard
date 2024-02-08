import { useDevModeContext } from "@dashboard/components/DevModePanel/hooks";
import { PromotionDetailsQuery } from "@dashboard/discounts/queries";

export const useGraphQLPlayground = () => {
  const devContext = useDevModeContext();

  const opepnGrapQLPlayground = (promotionId: string | null) => {
    devContext.setDevModeContent(PromotionDetailsQuery);
    devContext.setVariables(`{ "id": "${promotionId ?? ""}"}`);
    devContext.setDevModeVisibility(true);
  };

  return {
    opepnGrapQLPlayground,
  };
};
