import faker from "faker";

export type AddressType = {
  addressUK: AddressFieldsType;
  addressPL: AddressFieldsType;
  addressUS: AddressFieldsType;
};

export type AddressFieldsType = {
  firstName: string;
  lastName: string;
  companyName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  zip: string;
  city: string;
  country: string;
  countryArea: string;
};

export const ADDRESS: AddressType = {
  addressUS: {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    companyName: faker.company.companyName(),
    phone: "+12125771133",
    addressLine1: "69 W 9th Street",
    addressLine2: faker.address.county(),
    city: "New York",
    zip: "10001",
    country: "United States of America",
    countryArea: "New York",
  },
  addressPL: {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    companyName: faker.company.companyName(),
    phone: "+48225042123",
    addressLine1: "Teczowa",
    addressLine2: "7",
    city: "WROCLAW",
    zip: "53-601",
    country: "Poland",
    countryArea: "",
  },
  addressUK: {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    companyName: faker.company.companyName(),
    phone: "+445556667777",
    addressLine1: "Albert Street",
    addressLine2: "78/2",
    city: "Edinburgh",
    zip: "EH7 5LR",
    country: "United Kingdom",
    countryArea: "",
  },
};
