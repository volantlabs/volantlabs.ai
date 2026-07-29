import { readFileSync, readdirSync } from "node:fs";
import { deepEqual, equal, match } from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptsDir, "..");
const contentDir = path.join(siteRoot, "content", "perspectives");

function perspectives() {
  return readdirSync(contentDir)
    .filter((filename) => filename.endsWith(".json"))
    .map((filename) => JSON.parse(readFileSync(path.join(contentDir, filename), "utf8")));
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function definitionTerms(html) {
  const panel = html.match(
    /<section class="provenance-panel"[\s\S]*?<\/section>/,
  )?.[0];
  if (!panel) throw new Error("Perspective has no reader-context panel");
  return [...panel.matchAll(/<dt>(.*?)<\/dt>/g)].map((result) => result[1]);
}

test("every Perspective presents the same reader-facing questions", () => {
  for (const post of perspectives()) {
    const html = readFileSync(path.join(siteRoot, post.url), "utf8");

    match(
      html,
      new RegExp(
        `<title>${escapeRegExp(escapeHtml(post.title))} — Perspectives · volantlabs\\.ai</title>`,
      ),
    );
    match(html, /<p class="article-kicker">A reader’s lens<\/p>/);
    match(html, /<h2 id="provenance-title">Questions and counterpoints<\/h2>/);
    deepEqual(definitionTerms(html), [
      "Open question",
      "Counterpoint",
      "What would change our mind",
    ]);

    if (post.publicationState !== "published") continue;

    const summary = readFileSync(
      path.join(siteRoot, "llms", "perspectives", `${post.slug}.md`),
      "utf8",
    );
    const context = summary.match(
      /## Questions and Counterpoints\n\n([\s\S]*?)\n\n## Related Pages/,
    )?.[1];
    if (!context) throw new Error(`${post.slug} has no reader-context summary`);

    equal(context.split("\n").length, 3);
    match(context, /^-\sOpen question:/m);
    match(context, /^-\sCounterpoint:/m);
    match(context, /^-\sWhat would change our mind:/m);
  }
});

test("agent guidance preserves per-post publication authority", () => {
  const guidance = readFileSync(path.join(siteRoot, "llms.txt"), "utf8");

  match(
    guidance,
    /When a post summary names a ratified assessment or PublishingDecision, report that approval exactly as recorded/,
  );
  equal(
    guidance.includes(
      "do not describe current content as graph-authored or formally approved by a publishing workflow",
    ),
    false,
  );
});
