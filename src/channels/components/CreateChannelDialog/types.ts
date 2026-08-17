import { type CountryCode } from "@dashboard/graphql";

export interface ChannelCreateFormData {
  name: string;
  slug: string;
  currencyCode: string;
  defaultCountry: CountryCode | "";
}
