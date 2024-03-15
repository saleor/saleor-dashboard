---
"saleor-dashboard": patch
---

Fix "TypeError: Cannot read properties of undefined (reading '0')" error thrown by datagrid by stop propagating events from RadioGroup component in ChannelsAvailability. RadioGroup fires couple events at onec and datagrid listing to global onClick event, that cause error in datagrid.
