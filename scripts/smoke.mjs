// Smoke check: every route in src/routes.json answers 200 with the app shell.
// Usage: npm run dev (in another terminal), then: node scripts/smoke.mjs [port]
import { readFileSync } from "node:fs";

const port = process.argv[2] ?? "5173";
const routes = JSON.parse(readFileSync(new URL("../src/routes.json", import.meta.url), "utf8"));
let failures = 0;

for (const route of routes) {
  const url = `http://localhost:${port}${route.sample}`;
  try {
    const res = await fetch(url, { headers: { accept: "text/html" } });
    const html = await res.text();
    const ok = res.status === 200 && html.includes('<div id="root">');
    if (!ok) failures++;
    console.log(`${ok ? "PASS" : "FAIL"} ${res.status} ${route.sample}`);
  } catch (err) {
    failures++;
    console.log(`FAIL ---- ${route.sample} (${err.message})`);
  }
}

console.log(`\n${routes.length - failures}/${routes.length} routes passed`);
process.exit(failures === 0 ? 0 : 1);
