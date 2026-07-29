import { readFileSync, readdirSync } from "node:fs";
import { deepEqual, equal, ok } from "node:assert/strict";
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
    filename: field("filename"),
    title: field("title"),
    description: field("description"),
    alt: field("alt"),
  };
}

function manifestCardForPage(page) {
  const manifest = [
    ...JSON.parse(
      readFileSync(path.join(siteRoot, "assets", "images", "social", "manifest.json"), "utf8"),
    ),
    ...JSON.parse(
      readFileSync(path.join(siteRoot, "content", "perspectives.social-previews.json"), "utf8"),
    ),
  ];
  const card = manifest.find((entry) => entry.page === page);
  if (!card) throw new Error(`No social card manifest entry found for ${page}`);

  return {
    filename: path.basename(card.image),
    title: card.title,
    description: card.description,
    alt: card.alt,
  };
}

function perspectivePages() {
  const contentDir = path.join(siteRoot, "content", "perspectives");
  return readdirSync(contentDir)
    .filter((filename) => filename.endsWith(".json"))
    .map((filename) => JSON.parse(readFileSync(path.join(contentDir, filename), "utf8")))
    .map((post) => `/${post.url}`);
}

function pngDimensions(filename) {
  const image = readFileSync(filename);
  equal(image.subarray(1, 4).toString("ascii"), "PNG");
  return {
    width: image.readUInt32BE(16),
    height: image.readUInt32BE(20),
  };
}

test("every social card source entry matches the checked-in manifest", () => {
  const manifest = [
    ...JSON.parse(
      readFileSync(path.join(siteRoot, "assets", "images", "social", "manifest.json"), "utf8"),
    ),
    ...JSON.parse(
      readFileSync(path.join(siteRoot, "content", "perspectives.social-previews.json"), "utf8"),
    ),
  ];

  for (const { page } of manifest) {
    deepEqual(sourceCardForPage(page), manifestCardForPage(page), page);
  }
});

test("published social metadata is promoted out of the authoring-only manifest", () => {
  const publishedPage = "/perspectives/adding-my-book-collection-to-vellis.html";
  const publicManifest = JSON.parse(
    readFileSync(path.join(siteRoot, "assets", "images", "social", "manifest.json"), "utf8"),
  );
  const authoringManifest = JSON.parse(
    readFileSync(path.join(siteRoot, "content", "perspectives.social-previews.json"), "utf8"),
  );
  equal(publicManifest.some((entry) => entry.page === publishedPage), true);
  equal(authoringManifest.some((entry) => entry.page === publishedPage), false);
});

test("every Perspective has reproducible Open Graph metadata and a 1200 by 630 image", () => {
  for (const page of perspectivePages()) {
    const sourceCard = sourceCardForPage(page);
    const manifestCard = manifestCardForPage(page);
    deepEqual(sourceCard, manifestCard);

    const imagePath = path.join(siteRoot, "assets", "images", "social", manifestCard.filename);
    deepEqual(pngDimensions(imagePath), { width: 1200, height: 630 });

    const html = readFileSync(path.join(siteRoot, page), "utf8");
    const absoluteImage = `https://volantlabs.ai/assets/images/social/${manifestCard.filename}`;
    ok(html.includes(`<meta property="og:image" content="${absoluteImage}">`));
    ok(html.includes(`<meta name="twitter:image" content="${absoluteImage}">`));
    ok(html.includes('<meta name="twitter:card" content="summary_large_image">'));
  }
});
