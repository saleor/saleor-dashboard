import { SiteSettingsQuery } from "@dashboard/graphql";

export const shop: SiteSettingsQuery["shop"] = {
  __typename: "Shop",
  companyAddress: {
    __typename: "Address",
    city: "Kenstad",
    cityArea: "Alabama",
    companyName: "Saleor e-commerce",
    country: {
      __typename: "CountryDisplay",
      code: "UA",
      country: "United Arab Emirates",
    },
    countryArea: "",
    firstName: "",
    id: "1",
    lastName: "",
    phone: "+41 876-373-9137",
    postalCode: "89880-6342",
    streetAddress1: "01419 Bernhard Plain",
    streetAddress2: "s",
  },
  countries: [
    {
      __typename: "CountryDisplay",
      code: "UA",
      country: "United Arab Emirates",
    },
  ],
  customerSetPasswordUrl: "https://example.com/reset-password",
  defaultMailSenderAddress: "noreply@example.com",
  defaultMailSenderName: "Saleor",
  description: "Lorem ipsum dolor sit amet",
  domain: {
    __typename: "Domain",
    host: "localhost:8000",
  },
  name: "Saleor e-commerce",
  reserveStockDurationAnonymousUser: 10,
  reserveStockDurationAuthenticatedUser: 10,
  limitQuantityPerCheckout: 50,
  enableAccountConfirmationByEmail: true,
};
