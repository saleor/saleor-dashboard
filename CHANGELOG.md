# Changelog

All notable, unreleased changes to this project will be documented in this file. For the released changes, please visit the [Releases](https://github.com/saleor/saleor-dashboard/releases) page.

## [Unreleased]

- Pass query params in `ORDER_DETAILS_MORE_ACTIONS` and `PRODUCT_DETAILS_MORE_ACTIONS` mounting points - #2100 by @witoszekdev
- Add product variant reference attribute - #2268 by @droniu
- Fix dropdown select arrow clicks bugs - #2301 by @orzechdev
- Fix invalid values in channel picker - #2313 by @orzechdev
- Fix missing metadata and payment balance on unconfirmed orders - #2314 by @orzechdev
- Fix exit form dialog false positive - #2311 by @orzechdev
- Handle form errors before product creation - #2299 by @orzechdev
- Fix no product error on unconfirmed order lines - #2324 by @orzechdev
- Enable save button on discount pages - #2319 by @orzechdev
- Enable save button on page pages - #2325 by @orzechdev
- Fix pagination errors on voucher and sale pages - #2317 by @orzechdev

## 3.4

- Added links instead of imperative navigation with onClick - #1969 by @taniotanio7
- Fixed clearing attribute values - #2047 by @witoszekdev
- Fixed EditorJS integration in RichTextEditor input - #2052 by @witoszekdev
- Improvements to the app list page: added toggle and permision preview - #2035 by @witoszekdev

### 3.4.1

- Added links to table pagination buttons - #2063 by @witoszekdev
- Using push instead of replace to history stack for pagination navigation - #2063 by @witoszekdev

## 3.1

### PREVIEW FEATURES

- Gift cards - #1366, #1632 by @Cloud11PL and @bmigirl
- Preorders - #1426 by @JanChodorowski
- Add stock reservation settings - #1459 by @orzechdev
- Extending Dashboard with Apps - #1292 by @jwm0
- Optional SKU - #1440 by @orzechdev

### CHANGES

- Exit form dialog - #1816 by @bmigirl
- Variant selection attributes - #1463 by @golota60
- Click & Collect - #1292 by @kuchichan
- Add swatch attributes - #1301 by @piotrgrundas
- Limit quantity per checkout - #1536 by @kuchichan
- Disable query batching - #1922 by @dominik-zeglen

## 3.0

- Add Order Confirmation settings - #840 by @orzechdev and @mmarkusik
- Add Page Types - #807 by @orzechdev
- Add shipping methods to translation section - #864 by @marekchoinski
- New Miscellaneous and Product refunds - #870 by @orzechdev
- Add zip code exclusion - #877 by @dominik-zeglen
- Add order reissue
- Update quantity column in Inventory part of Product Variant view - #904 by @dominik-zeglen
- Add file attributes - #884 by @orzechdev
- Add shipping delivery days - #914 by @orzechdev
- Guard against non-staff users logging in - #947 by @jwm0
- Add reference attributes - #917 by @orzechdev
- Add product reference attributes - #948 by @orzechdev
- Drop descriptionJson and contentJson fields - #950 by @jwm0
- Add error tracking with Sentry adapter - #956 by @jwm0
- Add OAuth2 login with OpenID support - #963 by @orzechdev
- Add order and order line discounts and modal - #978 by @mmarkusik
- Fix no channels crash - #984 by @dominik-zeglen
- Update webhooks - #982 by @piotrgrundas
- Fix trigger form change when collections are being added to list of product collections - #987 by @gax97
- Add product variant webhooks - #1006 by @piotrgrundas
- Use default sort for search products list - #997 by @orzechdev
- Add text attribute input - #1023 by @piotrgrundas
- Update CollectionBulkDelete error type - #1030 by @d-wysocki
- Remove mailing settings - #1027 by @dominik-zeglen
- Update schema to contain email plugin changes - #1029 by @dominik-zeglen
- Fix creating shipping voucher - #1031 by @orzechdev
- Unconfirmed order manipulation - #967 by @tomaszszymanski129
- Add multiline field plugins - #974 by @dominik-zeglen
- Handle limit reached error - #990 by @dominik-zeglen
- Display Cloud limits - #1004 by @dominik-zeglen
- Introducing numeric attributes - #1065 by @piotrgrundas
- Add shipping method description - #1058 by @jwm0
- Fix voucher and sales sorting errors - #1063 by @orzechdev
- Fix custom currency formatting - #1067 by @orzechdev
- Drop deprecated fields - #1071 by @jwm0
- Add service worker - #1073 by @dominik-zeglen
- Choosing user shipping and billing addresses for draft order - #1082 by @orzechdev
- Fix EditorJS inline formatting - #1096 by @orzechdev
- Add product / page delete warning - #1095 by @mmarkusik
- Channels per plugin - #1093 by @mmarkusik
- Add pagination on attribute values - #1112 by @orzechdev
- Paginate attribute values in filters - #1152 by @orzechdev
- Fix attribute values input display - #1156 by @orzechdev
- Fix product type translations - #1163 by @orzechdev
- Support staff only voucher - #1174 by @orzechdev
- Fix label names in reference attributes - #1184 by @orzechdev
- Fix failing product update with file attribute - #1190 by @orzechdev
- Fix breaking select popups in filters - #1193 by @orzechdev
- Create channel filters in product, sales and voucher lists - #1187 by @jwm0
- Add generic filter validation - #1187 by @jwm0
- Fix duplicated labels in column picker - #1197 by @orzechdev
- Fix forbidden null sending as attribute value - #1201 by @orzechdev
- Fix missing call for update metadata mutation - #1207 by @orzechdev
- Disable next step when no value selected in variant selector - #1218 by @orzechdev
- Add boolean attributes - #1157 by @piotrgrundas
- Add embed plugin into editor-js - #1114 by @mociepka
- Add date & date time attributes - #1180 by @piotrgrundas
- Fix order links on home page - #1219 by @jwm0
- Fix incorrectly handled image upload errors - #1223 by @kamilpastuszka
- Fix huge payload issue for plugins view - #1203 by @kamilpastuszka
- Fix content type validation in create page view - #1205 by @orzechdev
- Fix list pagination crash on search - #1230 by @orzechdev
- Fix positive float number input validation - #1233 by @orzechdev
- Use MacawUI - #1229 by @dominik-zeglen
- Add Metadata for Sale & Voucher - #1245 by @piotrgrundas
- Add variant create options dialog - #1238 by @orzechdev
- Fixed issue with modals containing invalid, redundant scrolls #1240 by @kamilpastuszka
- Add text attribute for product and page translations - #1276 by @kamilpastuszka
- Improve auth flow, support token refreshing/expired tokens - #1593 by @orzechdev
- Blue theme redesign - #1623 by @dominik-zeglen
- Display error if no invoicing plugin is active - #1701 by @dominik-zeglen
- Update rest of the world checkbox on shipping zone details - #1673 by @orzechdev
- Sales per variant - #1578 by @Bonifacy1

# 2.11.1

- Support multiline text in plugin configuration secret field - #829 by @karolinakuzniewicz

## 2.11.0

- Add sku column to fulfillment cards - #538 by @dominik-zeglen
- Migrate product base price to variant prices - #555 by @orzechdev
- Migrate old notifications to the new ones - #587 by @AlicjaSzu
- Add background task manager - #574 by @dominik-zeglen
- Handle task failure and fix task duplication - #588 by @dominik-zeglen
- Move fragments to separate directory to avoid circular imports - #592 by @dominik-zeglen
- Add order invoices management - #570 by @orzechdev
- Add Cypress e2e runner - #584 by @krzysztofwolski
- create Apps - #599 by @AlicjaSzu
- Refactor authorization - #624 by @dominik-zeglen
- Fix minor bugs - #628 by @dominik-zeglen
- Add navigator button - #635 by @dominik-zeglen
- Update to newest schema - #638 by @dominik-zeglen
- Fix missing save button - #636 by @dominik-zeglen
- Fix user avatars - #639 by @dominik-zeglen
- Reset modal state after closing - #644 by @dominik-zeglen
- Fix incorrect messages - #643 by @dominik-zeglen
- Do not use devserver to run cypress tests - #650 by @dominik-zeglen
- Fix updating product that has no variants - #649 by @dominik-zeglen
- Update checkbox design - #651 by @dominik-zeglen
- Add warehouse choice - #646 by @dominik-zeglen
- Fix user management modal actions - #637 by @eaglesemanation
- Fix navigator button rendering on safari browser - #656 by @dominik-zeglen
- Use hooks instead of containers with render props in product mutations - #667 by @dominik-zeglen
- Add apps and permission groups to navigator - #678 by @dominik-zeglen
- Add metadata - #670 by @dominik-zeglen
- Update order history information - #680 by @dominik-zeglen
- Add metadata editor to creator views - #684 by @dominik-zeglen
- Update product visibility card component - #679 by @AlicjaSzu
- Update savebar design - #690 by @dominik-zeglen
- Add metadata to orders - #688 by @dominik-zeglen
- Add lazyload to locales - #692 by @eaglesemanation
- Fix not closed address update modal with two confirmations - #699 by @orzechdev
- Update schema with PositiveDecimal type - #695 by @AlicjaSzu
- Add error info when fetching taxes - #701 by @dominik-zeglen
- Fix return to previous page on screen size change - #710 by @orzechdev
- Fix updating order details on address change #711 - by @orzechdev
- Add no warehouses info when working with stock quantities #713 - by @orzechdev
- Add variants reordering possibility - #716 by @orzechdev
- Fix avatar change button - #719 by @orzechdev
- Add slug field to product, collection, category & page details (update and create) - #720 by @mmarkusik
- Allow product variant to be set as default - #721 by @tomaszszymanski129
- Change plural form of "informations" to "information" strings across the app #722 by @mmarkusik
- Fix misaligned rich text draft controls - #725 by @orzechdev
- Allow taxes to be configured per product - #728 by @dominik-zeglen
- Add default variant indicator for variant nav - #741 by @krzysztofwolski
- Fix style of product type attributes empty table - #744 by @orzechdev
- Fix order draft back button redirect - #753 by @orzechdev
- Add manage product types and attributes permission - #768 by @orzechdev
- Fix isPublished and isAvailable behaviour for products, collections and pages - #780 by @mmarkusik
- Add metadata editor to page views - #782 by @dominik-zeglen
- Add missing infinite scroll to searches - #793 by @dominik-zeglen
- Fix for fulfilling order when allocated quantity equals total quantity - #788 by @GrzegorzDerdak

## 2.10.1

- Add weight field and fix warehouse country selection - #597 by @dominik-zeglen
- Fix weight based rate update - #604 by @dominik-zeglen
- Add product export - #620 by @dominik-zeglen

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
