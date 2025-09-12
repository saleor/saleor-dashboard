Files provided by the user contain Typescript errors if strict mode is enabled.

We need to fix these errors to ensure the code is compatible with strict mode.

Ensure errors will not be present when strict mode is enabled. You can run `tsc --noEmit` to check for errors but remember to enable strict flag.
The rest of the config can be used from the original TSConfig file.

Also be careful about accessing "length" property from items that may be undefined or null.

For example "errors?.length" is not safe, because "errors" may be undefined or null. Instead use "errors && errors.length" or "Array.isArray(errors) ? errors.length : 0".

When adding placeholder with empty value like "", better use ?? instead ||, because || will have side effects, while ?? only acts for null or undefined values.
