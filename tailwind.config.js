/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",           // 扫描你当前目录的 HTML 文件
    "./pages/**/*.html",
    "./node_modules/preline/**/*.js"
  ],
  safelist: [
    {
      pattern: /hs-.*/,   // 保留 Preline 用到的所有 .hs-* 类名
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};