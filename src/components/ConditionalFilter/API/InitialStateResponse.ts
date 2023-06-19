import { UrlToken } from "../ValueProvider/UrlToken";

export class InitialStateResponse {
  constructor (
    public category: any,
    public attribute: any,
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