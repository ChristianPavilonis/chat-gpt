
const pxScale = () => {
  let scale = {
    px: "1px",
  };

  for (let i = 0; i <= 3000; i++) {
    scale[i] = i / 16 + "rem";
  }

  return scale;
};

const bgShades = {
  "shade-1": "var(--color-bg-shade-1)",
  "shade-2": "var(--color-bg-shade-2)",
  "shade-3": "var(--color-bg-shade-3)",
  default: "var(--color-bg-default)",
  "shade-5": "var(--color-bg-shade-5)",
  "shade-6": "var(--color-bg-shade-6)",
  "shade-9": "var(--color-bg-shade-9)",
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


    extend: {

      backgroundColor: bgShades,
      fill: bgShades,
      borderColor: bgShades,

      textColor: {
        default: "var(--color-text-default)",
        "shade-3": "var(--color-text-shade-3)",
        "shade-1": "var(--color-text-shade-1)",
      },

    },
  },
  plugins: [require('@tailwindcss/typography')],
}
