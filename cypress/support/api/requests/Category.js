import { getValueWithDefault } from "./utils/Utils";

export function createCategory({ name, slug = name, parent }) {
  const parentLine = getValueWithDefault(parent, `parent:"${parent}"`);
  const mutation = `mutation{
    categoryCreate(input:{name:"${name}", slug: "${slug}"} ${parentLine}){
      productErrors{
        field
        message
      }
      category{
        id
        name
      }
    }
  }`;
  return cy
    .sendRequestWithQuery(mutation)
    .its("body.data.categoryCreate.category");
}

export function getCategory(categoryId, translationLanguageCode) {
  const translation = getValueWithDefault(
    translationLanguageCode,
    `translation(languageCode:${translationLanguageCode}){
    name
    description
    seoTitle
    seoDescription
  }`
  );

  const mutation = `query{
    category(id:"${categoryId}"){
      name
      description
      products(first:100){
        edges{
          node{
            name
          }
        }
      }
      children(first:100){
        edges{
          node{
            name
          }
        }
      }
      ${translation}
    }
  }`;
  return cy.sendRequestWithQuery(mutation).its("body.data.category");
}

export function getCategories(first, search) {
  const mutation = `query{
    categories(first:${first}, filter:{
      search:"${search}"
    }){
      edges{
        node{
          id
          name
        }
      }
    }
  }`;
  return cy
    .sendRequestWithQuery(mutation)
    .then(resp => resp.body.data.categories.edges);
}

export function deleteCategory(categoryId) {
  const mutation = `mutation{
    categoryDelete(id:"${categoryId}"){
      productErrors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}

export function updateCategoryTranslation({
  categoryTranslateId,
  languageCode,
  seoTitle,
  seoDescription,
  name,
  description
}) {
  const mutation = `mutation Update_fields{
    categoryTranslate (id:"${categoryTranslateId}",languageCode:${languageCode},input:{
      seoTitle:"${seoTitle}",
      seoDescription:"${seoDescription}",
      name:"${name}"
      description: "{\\"time\\":1642670800306,\\"blocks\\":[{\\"id\\":\\"l8oQJqyxa3\\",\\"type\\":\\"paragraph\\",\\"data\\":{\\"text\\":\\"${description}\\"}}],\\"version\\":\\"2.22.2\\"}"
    })
    {
      errors{
        field
        message
      }
    }
  }
  `;
  return cy.sendRequestWithQuery(mutation);
}
