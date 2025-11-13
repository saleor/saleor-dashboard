import { FilterContainer } from "../FilterElement";
import { FilterElement } from "../FilterElement/FilterElement";
import { validateMetadataFilterElement } from "./metadata";
import { validateFilterElementToBeNumeric } from "./numeric";

const VALIDATORS = {
  NUMERIC: validateFilterElementToBeNumeric,
  price: validateFilterElementToBeNumeric,
  metadata: validateMetadataFilterElement,
} as Record<string, ValidateFn>;

const toValidated = (
  element: string | FilterElement | FilterContainer,
  index: number,
): RawValidateEntry => {
  if (!FilterElement.isFilterElement(element)) return false;

  const key = element.isAttribute ? element.value.type : element.value.value;
  const validateFn = VALIDATORS[key as keyof typeof VALIDATORS];

  if (validateFn) {
    return validateFn(element, index);
  }

  return false;
};

const hasErrors = (element: RawValidateEntry): element is ErrorEntry => {
  return element !== false;
};

export interface ErrorEntry {
  row: number;
  leftText?: string;
  conditionText?: string;
  rightText?: string;
}

type RawValidateEntry = false | ErrorEntry;
type ValidateFn = (element: FilterElement, row: number) => RawValidateEntry;

export class Validator {
  constructor(public container: FilterContainer) {}

  public isValid() {
    return !this.validate().some(hasErrors);
  }

  public getErrors() {
    return this.validate().filter(hasErrors);
  }

  private validate() {
    return this.container.map(toValidated);
  }
}
