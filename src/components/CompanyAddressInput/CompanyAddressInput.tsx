import React from "react";

import { DashboardCard } from "../Card";
import CompanyAddressForm, { CompanyAddressFormProps } from "./CompanyAddressForm";

interface CompanyAddressInputProps extends CompanyAddressFormProps {
  header: string;
}

const CompanyAddressInput: React.FC<CompanyAddressInputProps> = props => {
  const { header, ...formProps } = props;

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>{header}</DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <CompanyAddressForm {...formProps} />
      </DashboardCard.Content>
    </DashboardCard>
  );
};

CompanyAddressInput.displayName = "CompanyAddressInput";
export default CompanyAddressInput;
