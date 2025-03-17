import { useEffect, useState } from "react"

export function useStringToJSON(str: string) {
  const [json, setJson] = useState<Object | undefined>(undefined)

  useEffect(() => {
    try {
      setJson(JSON.parse(str))
    } catch (e) {
      setJson(undefined)
    }
  }, [str])

  return json
}
