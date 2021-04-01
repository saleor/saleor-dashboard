import { SEO_FORM } from "../../elements/shared/seo/seo-form-selectors";
export function editSeoSettings({ slug, title, description }) {
  cy.get(SEO_FORM.editSeoSettings)
    .click()
    .get(SEO_FORM.slugInput)
    .type(slug)
    .get(SEO_FORM.titleInput)
    .type(title)
    .get(SEO_FORM.descriptionInput)
    .type(description, { delay: 0 });
}
