import { TopNav } from "@dashboard/components/AppLayout";
import ButtonWithSelect from "@dashboard/components/ButtonWithSelect";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";

export interface HeaderProps {
  onOpenDialog: (open: boolean) => void;
}
const ProvinceHeader = (props: HeaderProps) => {
  const [open, setOpen] = useState(false);
  const handleCreatCity = () => {
    setOpen(true);
    props.onOpenDialog(open);
  };
  return (
    <>
      <TopNav title="provinces">
        <ButtonWithSelect
          onClick={handleCreatCity}
          options={[]}
          data-test-id="create-customer"
        >
          <FormattedMessage
            id="Px/gVb"
            defaultMessage="Create City"
            description="button"
          />
        </ButtonWithSelect>
      </TopNav>
    </>
  );
};

export default ProvinceHeader;
