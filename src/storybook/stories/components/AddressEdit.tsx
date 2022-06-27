import { Card, CardContent } from "@material-ui/core";
import AddressEdit from "@saleor/components/AddressEdit";
import { mapCountriesToChoices } from "@saleor/utils/maps";
import { storiesOf } from "@storybook/react";
import React from "react";

import { customer } from "../../../customers/fixtures";
import { transformAddressToForm } from "../../../misc";
import { countries } from "../../../orders/fixtures";
import Decorator from "../../Decorator";

storiesOf("Generics / AddressEdit", module)
  .addDecorator(Decorator)
  .add("default", () => (
    <Card
      style={{
        margin: "auto",
        width: 768,
      }}
    >
      <CardContent>
        <AddressEdit
          errors={[]}
          data={transformAddressToForm(customer.defaultBillingAddress)}
          countries={mapCountriesToChoices(countries)}
          countryDisplayValue={customer.defaultBillingAddress.country.country}
          onChange={undefined}
          onCountryChange={() => undefined}
        />
      </CardContent>
    </Card>
  ));
