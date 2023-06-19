import { UrlToken } from "../ValueProvider/UrlToken";
import { AttributeInputType } from "../staticConditions";

interface AttributeDTO {
  choices: { label: string, value: string, slug: string}[]
  inputType: AttributeInputType
  label: string
  slug: string
  value: string
}

export class InitialStateResponse {
  constructor (
    public category: any,
    public attribute: Record<string, AttributeDTO>,
    public channel: any,
    public collection: any,
    public producttype: any,
  ) {}

  public attributeByName (name: string) {
    return this.attribute[name]
  }

  public filterByUrlToken (token: UrlToken) {
    return this[token.name].filter(({ slug }) => token.value.includes(slug));
  }
}