import React from "react";
import CompanyAddressForm, {
  CompanyAddressFormProps,
} from "./CompanyAddressForm";
import { DashboardCard } from "../Card";

interface CompanyAddressInputProps extends CompanyAddressFormProps {
  className?: string;
  header: string;
}

const CompanyAddressInput: React.FC<CompanyAddressInputProps> = props => {
  const { className, header, ...formProps } = props;

  return (
    <DashboardCard>
      <DashboardCard.Title>{header}</DashboardCard.Title>
      <DashboardCard.Content>
        <CompanyAddressForm {...formProps} />
      </DashboardCard.Content>
    </DashboardCard>
  );
};
CompanyAddressInput.displayName = "CompanyAddressInput";
export default CompanyAddressInput;
