import Skeleton from '@dashboard/components/Skeleton';
import { CardContent } from '@material-ui/core';
import React from 'react';

import CardContainer from './VariantDetailsChannelsAvailabilityCardContainer';

export const CardSkeleton: React.FC = () => (
  <CardContainer>
    <CardContent>
      <Skeleton />
    </CardContent>
  </CardContainer>
);
