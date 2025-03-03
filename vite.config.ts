
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    host: "0.0.0.0",
    allowedHosts: [
      "00a8980d-361a-4999-95ef-7f96909cae99-00-1v300sazpl0az.spock.replit.dev",
      "00a8980d-361a-4999-95ef-7f96909cae99-00-1v300sazpl0az.spock.repl.co",
      ".replit.dev",
      ".repl.co"
    ]
  }
});
