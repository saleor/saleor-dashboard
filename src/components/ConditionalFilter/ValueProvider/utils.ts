export const createFiltersUrl = (filterValue) => {
  const flattenated = filterValue.map((el) => {
    if (typeof el === "string") return el

    if (Array.isArray(el)) return createFiltersUrl(el)

    return {
      [`${el.type}.${el.value}`]: el.condition.selected.value
    }
  })

  return stringify({ filter: flattenated })
}

export const createFiltersFromUrl = (parsedUrl) => {
  const flattenFilters = Object.values(parsedUrl).map(el => {
    if (typeof el === "string") return el

    if (Array.isArray(el)) return createFiltersFromUrl(el)

    const [key, value] = Object.entries(el)[0]
    const [type, slug] = key.split(".")

    const options = STATIC_CONDITIONS[slug]

    return {
      type,
      value: slug,
      condition: {
        options: STATIC_CONDITIONS[slug],
        selected: {
          type: "select",
          value: value,
          options: [],
        },
      },
    }
  })

  return flattenFilters
}