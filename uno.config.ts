import presetRemToPx from "@unocss/preset-rem-to-px"
import { defineConfig, presetUno } from "unocss"
import { presetEmmet } from "unocss-preset-emmet"

export default defineConfig({
  presets: [presetUno(), presetEmmet(), presetRemToPx()]
})
