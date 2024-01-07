module.exports = {
  extends: ["next/core-web-vitals"],
  rules: {
    // Disables the no-unescaped-entities rule
    "react/no-unescaped-entities": "off",

    // Disables the Next.js specific rule about using <img> instead of <Image />
    "@next/next/no-img-element": "off",

    // Add other rules you want to disable here
    "@next/next/no-sync-scripts": "off",
  },
  
};

