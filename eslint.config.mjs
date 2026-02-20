import type { Config } from "eslint";

const config: Config = {
  extends: ["next/core-web-vitals", "next/typescript"],
  rules: {
    "@next/next/no-img-element": "off"
  }
};

export default config;