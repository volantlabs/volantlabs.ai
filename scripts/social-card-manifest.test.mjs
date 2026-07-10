import { readFileSync } from "node:fs";
import { deepEqual } from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptsDir, "..");

function sourceCardForPage(page) {
  const source = readFileSync(path.join(scriptsDir, "generate-social-cards.mjs"), "utf8");
  const pageIndex = source.indexOf(`page: "${page}",`);
  if (pageIndex === -1) throw new Error(`No social card source found for ${page}`);

  const entryStart = source.lastIndexOf("{", pageIndex);
  const entryEnd = source.indexOf("\n  },", pageIndex);
  const entry = source.slice(entryStart, entryEnd);

  const field = (name) => {
    const match = entry.match(new RegExp(`${name}:\\s*\\n?\\s*"([^"]+)"`));
    if (!match) throw new Error(`No ${name} field found for ${page}`);
    return match[1];
  };

  return {
    title: field("title"),
    description: field("description"),
  };
}

function manifestCardForPage(page) {
  const manifest = JSON.parse(
    readFileSync(path.join(siteRoot, "assets", "images", "social", "manifest.json"), "utf8"),
  );
  const card = manifest.find((entry) => entry.page === page);
  if (!card) throw new Error(`No social card manifest entry found for ${page}`);

  return {
    title: card.title,
    description: card.description,
  };
}

test("open-data social card source matches checked-in manifest metadata", () => {
  const page = "/perspectives/open-data.html";

  deepEqual(sourceCardForPage(page), manifestCardForPage(page));
});
