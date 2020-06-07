# Changelog

All notable, unreleased changes to this project will be documented in this file. For the released changes, please visit the [Releases](https://github.com/mirumee/saleor-dashboard/releases) page.

## [Unreleased]

## 2.10.0

- Fix minor bugs - #244 by @dominik-zeglen
- Fix tax settings updating - #243 by @dominik-zeglen
- Add secret fields in plugin configuration - #246 by @dominik-zeglen
- Fix subcategories pagination - #249 by @dominik-zeglen
- Update customer's details page design - #248 by @dominik-zeglen
- Use Apollo Hooks - #254 by @dominik-zeglen
- Fix disappearing products description - #259 by @dominik-zeglen
- Improve mobile appearance - #240 by @benekex2 and @dominik-zeglen
- Use searches as hooks instead of components - #262 by @dominik-zeglen
- Add navigator - #267 by @dominik-zeglen
- Fix voucher limit - #271 by @dominik-zeglen
- Allow multiple images to be uploaded - #277 by @dominik-zeglen
- Fix dropdown clickable areas - #281 by @dominik-zeglen
- Use eslint - #285 by @dominik-zeglen
- Enforce using "name" property in style hooks - #288 by @dominik-zeglen
- Add ability to reset own password - #289 by @dominik-zeglen
- Move mutation state to mutation - #297 by @dominik-zeglen
- Add table sorting - #292 by @dominik-zeglen
- Unify dialog handling - #296 by @dominik-zeglen
- Stop using deprecated fields - #357 by @dominik-zeglen
- Throw error when API_URI is not set - #375 by @dominik-zeglen
- Fix variant stock input - #377 by @dominik-zeglen
- Add filtering to views - #361 by @dominik-zeglen
- Do not render password change if authenticating - #378 by @dominik-zeglen
- Fix crash when one product is selected - #391 by @dominik-zeglen
- Improve product update form error handling - #392 by @dominik-zeglen
- Fix column picker errors - #393 by @dominik-zeglen
- Improve order filters - #396 by @dominik-zeglen
- Use structurized JSON files instead of PO - #403 by @dominik-zeglen
- Remove PO files from repo and update translations #409 by @dominik-zeglen
- Add optional chaining and explicitely return "Not found" page - #408 by @dominik-zeglen
- Do not store errors in form component - #410 by @dominik-zeglen
- Handle rich text editor content error - #395 by @dominik-zeglen
- Fix crashing views - #422 by @dominik-zeglen
- Add "Ready to capture" to the "Status" order filter - #430 by @dominik-zeglen
- Reset state after closing - #456 by @dominik-zeglen
- Password validation errors are not shown - #471 by @gabmartinez
- Reset pagination when guest change the sorting of the list - #474 by @gabmartinez
- Filter column ids before send it to GridAttributes operation - #476 by @gabmartinez
- Display Is Published column correctly in main Product Listing - #475 by @gabmartinez
- Add Permission Groups section - #406 by @krzysztofwolski
- Add warehouse management - #390 by @dominik-zeglen
- Fix minor visual bugs - #521 by @dominik-zeglen
- Handle session expiration - #520 by @dominik-zeglen
- Update product stock management to newest design - #515 by @dominik-zeglen
- Handle untracked products - #523 by @dominik-zeglen
- Display correct error if there were no graphql errors - #525 by @dominik-zeglen

## 2.0.0

- Add changelog and github issue/PR templates - #97 by @dominik-zeglen
- Update dependencies to suppress storybook build errors - #98 by @dominik-zeglen
- Fix configure menu section - #109 by @benekex2
- Add switch to make attribute available in product list as a column - #99 by @dominik-zeglen
- Add tc tags for E2E testing - #134 by @dominik-zeglen
- Use react-intl - #105 by @dominik-zeglen
- Add dynamic dashboard settings - #135 by @benekex2
- Fix plugins page translations - #141 by @benekex2
- Add attributes to column picker - #136 by @dominik-zeglen
- Fix table cell padding - #143 by @dominik-zeglen
- Add fallback locale - #153 by @dominik-zeglen
- Replace checkbox with switch component in "product type has variants" - #152 by @dominik-zeglen
- Add password reset flow - #147 by @dominik-zeglen
- Add support for multiple values in filters - #160 by @dominik-zeglen
- UI improvements - #166 by @benekex2
- Fix en locale matching - #165 by @dominik-zeglen
- Implement the Credential Management API - #158 by @patrys
- Add search bars - #172 by @dominik-zeglen
- Add sorting to product list - #173 by @dominik-zeglen
- Add Heroku integration - #175 by @bogdal
- Fix navigation - #182 by @benekex2
- Add testcafe tags to attributes, categories, collections and product types - #178 by @dominik-zeglen
- Fix input error style - #183 by @benekex2
- Fix product type selection - #189 by @dominik-zeglen
- Fix staff return link - #190 by @dominik-zeglen
- Allow sorting products by attribute - #180 by @dominik-zeglen
- Hide variants and attributes if product has none - #179 by @dominik-zeglen
- Add service account section - #188 by @dominik-zeglen
- Add webhook section - #206 by @benekex2
- Add variant creator - #177 by @dominik-zeglen
- Add git hooks - #209 by @dominik-zeglen
- Do not send customer invitation email - #211 by @dominik-zeglen
- Send address update mutation only once - #210 by @dominik-zeglen
- Update sale details design - #207 by @dominik-zeglen
- Improve autocomplete UX - #212 by @dominik-zeglen
- Fix empty attribute values - #218 by @dominik-zeglen
- Add language switch - #213 by @dominik-zeglen
- Fix copy - #223, #224 by @dominik-zeglen
- Fix ui improvements - #226 by @benekex2
- Fix attribute errors - #216 by @dominik-zeglen
- Fix column picker - #228 by @dominik-zeglen
- Add readonly mode - #229 by @dominik-zeglen
- Add mailing configuration - #222 by @dominik-zeglen
- Fix minor bugs - #230 by @dominik-zeglen
- Fix permission handling - #231 by @dominik-zeglen
- Use React.FC instead of deprecated React.StatelessComponent type - #245 by @dominik-zeglen
- Update @material-ui to v4 - #234 by @dominik-zeglen
