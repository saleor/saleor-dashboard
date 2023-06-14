import useRouter from "use-react-router"
import { FilterValueProvider } from "../FilterValueProvider"
import { FilterElement } from "../FilterElement"
import { TokenArray, tokenizeUrl } from "./tokenize"
import { obtainFetchingParams } from "./fetchingParams"


const mapUrlTokensToFilterValues = (urlTokens: TokenArray, response) => {
  return urlTokens.map((el) => {
    if (typeof el === "string") return el

    if (Array.isArray(el)) return mapUrlTokensToFilterValues(el, response)
    
    return FilterElement.fromUrlToken(el, response)
  })
}

export const useUrlValueProvider = (): FilterValueProvider => {
  const router = useRouter()
  const tokenizedUrl = tokenizeUrl("0[s0.category]=cat1&1=o&2[a2.color][0]=red&2[a2.color][1]=green&3=a&4[a2.size][0]=m&4[a2.size][1]=xl&5=a&6[s4.price]=123&7=a&8[0][s2.category][0]=cat2&8[0][s2.category][1]=cat3&8[1]=o&8[2][s3.price][0]=1&8[2][s3.price][1]=103")
  const fetchingParams = obtainFetchingParams(tokenizedUrl)
  const result = mapUrlTokensToFilterValues(tokenizedUrl, {})


  console.log("tokenized", tokenizedUrl)
  console.log("flatenated", fetchingParams)
  console.log("result", result)


  // const structure = [
  //   { "s0.category": "cat1"},
  //   "o",
  //   { "a2.color": ["red", "green"]},
  //   "a",
  //   { "a2.size": ["m", "xl"]},
  //   "a",
  //   { "s4.price": 123},
  //   "a",
  //   [
  //     { "s2.category": ["cat2", "cat3"]},
  //     "o",
  //     { "s3.price": [1, 103]},
  //   ]
  // ]

  // console.log(
  //   "url test",
  //   stringify(structure,{ 
  //     // encode: false,
  //     // indices: false
  //   })
  // )


  const persist = (filterValue: (string | FilterElement)[]) => {  
    // const search = createFiltersUrl(filterValue)

    // router.history.replace({
    //   pathname: router.location.pathname,
    //   search
    // })
  }



  return {
    value: [],
    persist
  }
}