import { onCLS, onINP, onLCP } from "web-vitals"

import type { SEOWebVitals } from "../types"

type VitalsState = {
  LCP?: SEOWebVitals
  CLS?: SEOWebVitals
  INP?: SEOWebVitals
}

const initialState: VitalsState = {
  LCP: undefined,
  CLS: undefined,
  INP: undefined
}

const formatVitalValue = (value: number): number =>
  Math.floor(value * 100) / 100

export const createWebVitalsObserver = (
  callback: (state: VitalsState) => void
): void => {
  let state = { ...initialState }

  const updateState = (
    key: keyof VitalsState,
    value: SEOWebVitals
  ): VitalsState => {
    state = {
      ...state,
      [key]: value
    }
    return state
  }

  onLCP((res) => {
    const newState = updateState("LCP", {
      rating: res.rating,
      value: formatVitalValue(res.value)
    })
    callback(newState)
  })

  onCLS((res) => {
    const newState = updateState("CLS", {
      rating: res.rating,
      value: formatVitalValue(res.value)
    })
    callback(newState)
  })

  onINP((res) => {
    const newState = updateState("INP", {
      rating: res.rating,
      value: formatVitalValue(res.value)
    })
    callback(newState)
  })
}

export const getWebVitalsState = (state: VitalsState): VitalsState => ({
  ...state
})
