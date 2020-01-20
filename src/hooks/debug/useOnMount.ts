import { useEffect } from "react";

function useOnMount(name: string) {
  // eslint-disable-next-line no-console
  useEffect(() => console.log(`mounted node ${name}`), []);
}

export default useOnMount;
