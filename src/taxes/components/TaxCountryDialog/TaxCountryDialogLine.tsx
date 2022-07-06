import { Divider } from "@material-ui/core";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import { ChangeEvent } from "@saleor/hooks/useForm";
import React from "react";

import { CountryFragmentWithState } from "./TaxCountryDialog";

export interface TaxCountryDialogLineProps {
  country: CountryFragmentWithState;
  handleChange: (e: ChangeEvent) => void;
  checked: boolean;
}

export const TaxCountryDialogLine: React.FC<TaxCountryDialogLineProps> = React.memo(
  ({ country, handleChange, checked }) => (
    <>
      <ControlledCheckbox
        name={country.code}
        checked={checked}
        onChange={handleChange}
        label={country.country}
      />
      <Divider />
    </>
  )
);
