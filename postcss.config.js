/**
 * @type {import('postcss').ProcessOptions}
 */
module.exports = {
  plugins: {
    "@unocss/postcss": {
      // Optional

      content: ["**/*.{html,js,ts,jsx,tsx}!(node_modules/**)"]
    }
  }
}
