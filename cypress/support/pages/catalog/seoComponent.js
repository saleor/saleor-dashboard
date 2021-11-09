import { SEO_FORM } from "../../../elements/shared/seo/seo-form-selectors";
export function editSeoSettings({ slug, title, description }) {
  cy.get(SEO_FORM.editSeoSettings)
    .click()
    .get(SEO_FORM.slugInput)
    .clearAndType(slug)
    .get(SEO_FORM.titleInput)
    .clearAndType(title)
    .get(SEO_FORM.descriptionInput)
    .clearAndType(description, { delay: 0 });
}
