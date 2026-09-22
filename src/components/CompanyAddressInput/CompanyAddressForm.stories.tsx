import { type AddressTypeInput } from "@dashboard/customers/types";
import { AccountErrorCode } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { withApolloMocks } from "@storybookUtils/apollo";
import { useState } from "react";
import { fn } from "storybook/test";

import { CompanyAddressForm } from "./CompanyAddressForm";

const countries = [
  { label: "Poland", value: "PL" },
  { label: "United States", value: "US" },
  { label: "Germany", value: "DE" },
];

const baseData: AddressTypeInput = {
  city: "Wrocław",
  companyName: "Saleor Commerce",
  country: "PL",
  countryArea: "",
  firstName: "",
  lastName: "",
  phone: "+48123456789",
  postalCode: "50-001",
  streetAddress1: "Rynek 1",
  streetAddress2: "",
};

const meta: Meta<typeof CompanyAddressForm> = {
  title: "Components/CompanyAddressForm",
  component: CompanyAddressForm,
  decorators: [
    withApolloMocks([]),
    (Story: StoryFn) => (
      <Box __maxWidth="720px" padding={4}>
        <Story />
      </Box>
    ),
  ],
  args: {
    countries,
    data: baseData,
    displayCountry: "Poland",
    disabled: false,
    errors: [],
    onChange: fn(),
    onCountryChange: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof CompanyAddressForm>;

const Interactive = () => {
  const [data, setData] = useState(baseData);

  return (
    <CompanyAddressForm
      countries={countries}
      data={data}
      displayCountry="Poland"
      disabled={false}
      errors={[]}
      onChange={event =>
        setData(current => ({ ...current, [event.target.name]: event.target.value }))
      }
      onCountryChange={event =>
        setData(current => ({ ...current, [event.target.name]: event.target.value }))
      }
    />
  );
};

export const Default: Story = { render: () => <Interactive /> };

export const Empty: Story = {
  args: {
    data: { ...baseData, city: "", companyName: "", phone: "", postalCode: "", streetAddress1: "" },
    displayCountry: "",
  },
};

export const Disabled: Story = { args: { disabled: true } };

export const WithErrors: Story = {
  args: {
    data: { ...baseData, companyName: "", postalCode: "" },
    errors: [
      {
        __typename: "AccountError",
        code: AccountErrorCode.REQUIRED,
        field: "companyName",
        addressType: null,
        attributes: null,
        message: "Company name is required",
      },
      {
        __typename: "AccountError",
        code: AccountErrorCode.INVALID,
        field: "postalCode",
        addressType: null,
        attributes: null,
        message: "Enter a valid postal code",
      },
    ],
  },
};
