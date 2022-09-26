import { CardContent } from "@material-ui/core";
import Skeleton from "@saleor/components/Skeleton";
import React from "react";

import CardContainer from "./VariantDetailsChannelsAvailabilityCardContainer";

export const CardSkeleton: React.FC = () => (
  <CardContainer>
    <CardContent>
      <Skeleton />
    </CardContent>
  </CardContainer>
);
