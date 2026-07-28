export interface ReadonlyAddressData {
  firstName?: string | null;
  lastName?: string | null;
  companyName?: string | null;
  phone?: string | null;
  streetAddress1?: string | null;
  streetAddress2?: string | null;
  city?: string | null;
  cityArea?: string | null;
  postalCode?: string | null;
  countryArea?: string | null;
  country: {
    country: string;
    code?: string;
  };
}

export type ReadonlyAddressVariant = "compact" | "default";
