
const pxScale = () => {
  let scale = {
    px: "1px",
  };

  for (let i = 0; i <= 3000; i++) {
    scale[i] = i / 16 + "rem";
  }

  return scale;
};


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,vue}",
    ],
  theme: {
    spacing: pxScale(),
    maxWidth: pxScale(),
    minWidth: pxScale(),
    maxHeight: pxScale(),
    minHeight: pxScale(),


    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
}
