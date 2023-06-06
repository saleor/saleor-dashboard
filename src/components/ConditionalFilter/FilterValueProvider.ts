import useRouter from "use-react-router";
import { FilterElement } from "./FilterElement";
import { stringify, parse } from "qs";
import { STATIC_CONDITIONS } from "./staticConditions";

export interface FilterValueProvider {
  read: () => (string | FilterElement)[]
  persist: (newValue: (string | FilterElement)[]) => void
}

const createFiltersUrl = (filterValue) => {
  const flattenated = filterValue.map((el) => {
    if (typeof el === "string") return el

    if (Array.isArray(el)) return createFiltersUrl(el)

    return {
      [`${el.type}.${el.value}`]: el.condition.selected.value
    }
  })

  return stringify({ filter: flattenated })
}

const createFiltersFromUrl = (parsedUrl) => {
  const flattenFilters = Object.values(parsedUrl).map(el => {
    if (typeof el === "string") return el

    if (Array.isArray(el)) return createFiltersFromUrl(el)

    const [key, value] = Object.entries(el)[0]
    const [type, slug] = key.split(".")

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

export const useUrlValueProvider = (): FilterValueProvider => {
  const router = useRouter()


  const persist = (filterValue: (string | FilterElement)[]) => {  
    const search = createFiltersUrl(filterValue)

    router.history.replace({
      pathname: router.location.pathname,
      search
    })
  }

  const read = () => {
    const parsedUrl = parse(router.location.search.slice(1))

    if (!parsedUrl.filter) return []

    const structure = createFiltersFromUrl(parsedUrl.filter)

    console.log("filter structure", structure)

    return structure
  }

  return {
    read,
    persist
  }
}