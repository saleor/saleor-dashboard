interface CustomerDetailsIdentityForm {
  customerTypeId: string;
  email: string;
  firstName: string;
  lastName: string;
  note: string;
}

export interface CustomerSaveComposition {
  hasAttributes: boolean;
  hasGeneral: boolean;
  hasType: boolean;
}

export const EMPTY_CUSTOMER_SAVE_COMPOSITION: CustomerSaveComposition = {
  hasAttributes: false,
  hasGeneral: false,
  hasType: false,
};

export const buildCustomerSaveComposition = ({
  attributesDirty,
  data,
  initial,
}: {
  attributesDirty: boolean;
  data: CustomerDetailsIdentityForm;
  initial: CustomerDetailsIdentityForm;
}): CustomerSaveComposition => ({
  hasAttributes: attributesDirty,
  hasGeneral:
    data.email !== initial.email ||
    data.firstName !== initial.firstName ||
    data.lastName !== initial.lastName ||
    data.note !== initial.note,
  hasType: data.customerTypeId !== initial.customerTypeId,
});

export const hasCustomerSaveComposition = (composition: CustomerSaveComposition): boolean =>
  composition.hasAttributes || composition.hasGeneral || composition.hasType;
