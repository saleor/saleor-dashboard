import useRouter from "use-react-router"
import { FilterValueProvider } from "../FilterValueProvider"
import { stringify } from "qs"
import { FilterElement } from "../FilterElement"
import { decodeUrl } from "./serialize"


export const useUrlValueProvider = (): FilterValueProvider => {
  const router = useRouter()
  const tokenizedUrl = decodeUrl("0[s0.category]=cat1&1=o&2[s4.price]=123&3=a&4[0][s2.category][0]=cat2&4[0][s2.category][1]=cat3&4[1]=o&4[2][s3.price][0]=1&4[2][s3.price][1]=103")
  
  console.log("tokenized", tokenizedUrl)
  
  // const structure = [
  //   { "s0.category": "cat1"},
  //   "o",
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
  //     encode: false,
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