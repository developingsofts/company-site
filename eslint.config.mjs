import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Vendored React Bits components keep their latest props in a ref during
  // render so their animation loop reads them without restarting; they are
  // replaced on update, not edited.
  {
    files: ["src/components/{SwarmCursor,Noise,MagicBento}.tsx"],
    rules: { "react-hooks/refs": "off" },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
