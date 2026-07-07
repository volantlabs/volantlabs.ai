#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const requiredPartnersLogo = path.join(
  siteRoot,
  "assets",
  "logos",
  "volant-partners-bug-orange.png",
);
const requiredLabsLogo = path.join(
  siteRoot,
  "assets",
  "logos",
  "volant-labs-flask-mark.svg",
);
const requiredLabsFavicon = path.join(
  siteRoot,
  "assets",
  "logos",
  "volant-labs-flask-favicon.svg",
);
const ga4MeasurementId = "G-VNXWVPERBQ";
const ga4ScriptUrl = `https://www.googletagmanager.com/gtag/js?id=${ga4MeasurementId}`;
const publicFiles = listFiles(siteRoot)
  .filter((file) => /\.(html|js|xml|json|css)$/.test(file))
  .filter((file) => !file.includes(`${path.sep}design${path.sep}`))
  .filter((file) => !file.includes(`${path.sep}scripts${path.sep}`));
const publicHtmlFiles = publicFiles.filter((file) => file.endsWith(".html"));

const requiredStrings = [
  "https://github.com/volantlabs/vellis",
  "https://github.com/volantlabs/vellis/releases",
  "https://github.com/volantlabs/vellis/issues",
  "git clone https://github.com/volantlabs/vellis.git",
  "labs@volantpartners.com",
  "https://www.volantpartners.com/contact",
  "Volant Partners helps teams turn complex technical work into reliable products, operations, and decisions.",
  "volant-labs-flask-mark.svg",
  "volant-labs-flask-favicon.svg",
];

const approvedPartnersBlurb =
  "Volant Partners helps teams turn complex technical work into reliable products, operations, and decisions.";
const volantPartnersUrl = "https://www.volantpartners.com/";
const volantPartnersText = "Volant Partners";

const forbiddenPatterns = [
  new RegExp("hello@" + "volantpartners\\.com"),
  new RegExp("orgs/" + "volantlabs/vellis"),
  new RegExp("request the current " + "local-start path", "i"),
  new RegExp("Local " + "start"),
  new RegExp("Production " + "support"),
  new RegExp("https://kesher\\.volantpartners\\.ai/files/" + "download"),
  new RegExp('<line x1=\\"6\\" y1=\\"6\\" x2=\\"18\\" y2=\\"18\\"'),
  new RegExp(
    '<circle cx=\\"6\\" cy=\\"18\\" r=\\"2\\\\.4\\" fill=\\"#D15B21\\"',
  ),
  new RegExp("M10 3v5\\.2L5\\.9 17\\.1C5 19\\.1"),
];

const failures = [];
const corpus = publicFiles
  .map((file) => `${relative(file)}\n${readFileSync(file, "utf8")}`)
  .join("\n");
const plainCorpus = normalizeWhitespace(stripTags(corpus));

if (!existsSync(requiredPartnersLogo)) {
  failures.push(
    `Missing local Volant Partners logo asset: ${relative(requiredPartnersLogo)}`,
  );
}

if (!existsSync(requiredLabsLogo)) {
  failures.push(
    `Missing local Volant Labs logo asset: ${relative(requiredLabsLogo)}`,
  );
}

if (!existsSync(requiredLabsFavicon)) {
  failures.push(
    `Missing local Volant Labs favicon asset: ${relative(requiredLabsFavicon)}`,
  );
}

if (
  existsSync(requiredLabsLogo) &&
  /stroke:white;stroke-width:8px/.test(readFileSync(requiredLabsLogo, "utf8"))
) {
  failures.push(
    "Primary Volant Labs logo still contains the rejected white outline under-stroke",
  );
}

for (const needle of requiredStrings) {
  if (!corpus.includes(needle) && !plainCorpus.includes(needle))
    failures.push(`Missing required public string: ${needle}`);
}

for (const pattern of forbiddenPatterns) {
  const offenders = publicFiles.filter((file) =>
    pattern.test(readFileSync(file, "utf8")),
  );
  if (offenders.length) {
    failures.push(
      `Forbidden pattern ${pattern} found in ${offenders.map(relative).join(", ")}`,
    );
  }
}

for (const file of publicHtmlFiles) {
  assertGa4Tracking(relative(file), readFileSync(file, "utf8"));
}

const handAuthoredPages = [
  "index.html",
  "engine.html",
  "thesis.html",
  "perspectives.html",
  "community.html",
  "platform.html",
  "domain-explorations.html",
];

for (const page of handAuthoredPages) {
  const html = readFileSync(path.join(siteRoot, page), "utf8");
  if (!html.includes('class="footer-brand-grid"'))
    failures.push(`${page} footer is missing the two-brand footer grid`);
  if (!html.includes('class="footer-logo"'))
    failures.push(`${page} footer is missing the Volant Partners bug asset`);
  if (!normalizeWhitespace(stripTags(html)).includes(approvedPartnersBlurb)) {
    failures.push(
      `${page} footer is missing the approved Volant Partners blurb`,
    );
  }
  if (!html.includes('src="assets/logos/volant-labs-flask-mark.svg"')) {
    failures.push(
      `${page} is missing the site-local Volant Labs logo asset`,
    );
  }
  if (
    !/<link\s+rel="icon"\s+href="assets\/logos\/volant-labs-flask-favicon\.svg"\s+type="image\/svg\+xml"\s*\/?>/.test(
      html,
    )
  ) {
    failures.push(`${page} is missing the Volant Labs SVG favicon asset`);
  }
  if (
    !/<header[\s\S]*?<img\s+class="labs-logo"\s+src="assets\/logos\/volant-labs-flask-mark\.svg"/.test(
      html,
    )
  ) {
    failures.push(`${page} header should use the Volant Labs logo asset`);
  }
  if (
    !/<img\s+class="labs-logo"[\s\S]*?width="50"[\s\S]*?height="50"/.test(html)
  ) {
    failures.push(
      `${page} does not render the Volant Labs logo at the approved 50x50 size`,
    );
  }
  assertHeaderButtonTypography(page, html);
  assertEyebrowNotLinkColored(page, html);
  assertPassiveBandLaneNotOrange(page, html);
  assertNoNestedAnchors(page, html);
  assertVolantPartnersFooterLinks(page, html);
}

const generatedArticle = readFileSync(
  path.join(siteRoot, "perspectives", "runtime-controls.html"),
  "utf8",
);
const indexHtml = readFileSync(path.join(siteRoot, "index.html"), "utf8");
const sharedCss = readFileSync(
  path.join(siteRoot, "assets", "site.css"),
  "utf8",
);
if (
  !/<link\s+rel="icon"\s+href="assets\/logos\/volant-labs-flask-favicon\.svg"\s+type="image\/svg\+xml"\s*\/?>/.test(
    indexHtml,
  )
) {
  failures.push(
    "index.html is missing the relative Volant Labs SVG favicon link",
  );
}
if (/href="\/assets\/logos\/volant-labs-flask-favicon\.svg"/.test(indexHtml)) {
  failures.push(
    "index.html favicon link should be relative so it works under app session routes",
  );
}
if (!/<img\s+class="labs-logo"\s+src="assets\/logos\/volant-labs-flask-mark\.svg"\s+alt="Volant Labs"[\s\S]*?width="50"[\s\S]*?height="50"/.test(indexHtml)) {
  failures.push(
    "index.html header Volant Labs logo is missing meaningful alt text",
  );
}
if (
  !/<img\s+class="footer-logo"\s+src="assets\/logos\/volant-labs-flask-mark\.svg"\s+alt="Volant Labs"[\s\S]*?width="50"[\s\S]*?height="50"/.test(
    indexHtml,
  )
) {
  failures.push("index.html footer Volant Labs logo is missing meaningful alt text");
}
if (
  !/<img\s+class="footer-logo"\s+src="assets\/logos\/volant-partners-bug-orange\.png"\s+alt="Volant Partners"[\s\S]*?width="50"[\s\S]*?height="50"/.test(
    indexHtml,
  )
) {
  failures.push(
    "index.html footer Volant Partners logo is missing meaningful alt text",
  );
}
if (
  /src="assets\/logos\/(?:volant-labs-flask-mark\.svg|volant-partners-bug-orange\.png)"[\s\S]{0,160}?aria-hidden="true"/.test(
    indexHtml,
  )
) {
  failures.push("index.html meaningful logo images should not be aria-hidden");
}
if (
  /@media \(max-width: 880px\)[\s\S]*?\.hero-figure\s*\{[\s\S]*?order:\s*-1/.test(
    indexHtml,
  )
) {
  failures.push(
    "index.html mobile hero still moves the illustration before the copy",
  );
}
if (
  !/@media \(max-width: 560px\)\s*\{[\s\S]*?\.navlinks\s*\{[\s\S]*?overflow-x:\s*auto;[\s\S]*?flex-wrap:\s*nowrap;[\s\S]*?gap:\s*var\(--s4\);[\s\S]*?\.navlinks a\s*\{[\s\S]*?white-space:\s*nowrap;/.test(
    sharedCss,
  )
) {
  failures.push(
    "Mobile nav at max-width 560px should remain horizontally scrollable without wrapping",
  );
}
if (
  /@media \(max-width: 560px\)\s*\{[\s\S]*?\.navlinks\s*\{[\s\S]*?overflow:\s*visible;/.test(
    sharedCss,
  )
) {
  failures.push("Mobile nav at max-width 560px still uses overflow: visible");
}
if (
  !/\.footer-brand-grid\s*\{[\s\S]*?max-width:\s*min\(680px,\s*100%\);/.test(
    sharedCss,
  )
) {
  failures.push(
    "Shared footer CSS should let the brand text area extend toward the footer links",
  );
}
if (
  !/\.footer-brand\s*\{[\s\S]*?display:\s*grid;[\s\S]*?grid-template-columns:\s*50px minmax\(0,\s*1fr\);/.test(
    sharedCss,
  )
) {
  failures.push(
    "Shared footer CSS no longer gives each brand a flexible two-column grid",
  );
}
if (
  !/\.footer-brand \.brand > img,[\s\S]*?grid-row:\s*1 \/ span 2;/.test(
    sharedCss,
  )
) {
  failures.push(
    "Shared footer CSS no longer makes footer logos span the title and blurb rows",
  );
}
if (
  !/\.volant-partners-link\s*\{[\s\S]*?color:\s*inherit;[\s\S]*?text-decoration:\s*none;/.test(
    sharedCss,
  )
) {
  failures.push(
    "Volant Partners links should inherit current text color and have no underline by default",
  );
}
if (
  !/\.volant-partners-link:hover\s*\{[\s\S]*?text-decoration:\s*underline;/.test(
    sharedCss,
  )
) {
  failures.push("Volant Partners links should add underline on hover");
}
if (
  !/\.band-head\s*>\s*\.lane\s*\{[\s\S]*?color:\s*var\(--text\)/.test(
    sharedCss,
  )
) {
  failures.push(
    "Shared band-head lane text should use the standard text color",
  );
}

if (!generatedArticle.includes('class="footer-brand-grid"'))
  failures.push(
    "Generated article footer is missing the two-brand footer grid",
  );
if (!generatedArticle.includes('class="footer-logo"'))
  failures.push(
    "Generated article footer is missing the Volant Partners bug asset",
  );
if (
  !generatedArticle.includes(
    'src="../assets/logos/volant-labs-flask-mark.svg"',
  )
) {
  failures.push(
    "Generated article header is missing the site-local Volant Labs logo asset",
  );
}
if (!/<header[\s\S]*?<img\s+class="labs-logo"\s+src="\.\.\/assets\/logos\/volant-labs-flask-mark\.svg"/.test(generatedArticle)) {
  failures.push("Generated article header should use the Volant Labs logo asset");
}
if (
  /<header[\s\S]*?<img\s+class="labs-logo"\s+src="\.\.\/assets\/logos\/volant-labs-logo-square(?:-dark)?\.svg"/.test(
    generatedArticle,
  )
) {
  failures.push(
    "Generated article header still uses a legacy Volant Labs logo asset",
  );
}
if (
  !/<img\s+class="labs-logo"[\s\S]*?width="50"[\s\S]*?height="50"/.test(
    generatedArticle,
  )
) {
  failures.push(
    "Generated article does not render the Volant Labs logo at the approved 50x50 size",
  );
}
if (
  !generatedArticle.includes(
    'mailto:labs@volantpartners.com?subject=Subscribe%20to%20volantlabs.ai%20Perspectives"',
  )
) {
  failures.push(
    "Generated article subscribe CTA does not use labs@volantpartners.com",
  );
}
assertNoNestedAnchors("perspectives/runtime-controls.html", generatedArticle);
assertVolantPartnersFooterLinks(
  "perspectives/runtime-controls.html",
  generatedArticle,
);

const labNote =
  indexHtml.match(/<div class="lab-note"[\s\S]*?<\/div>\s*<\/div>/)?.[0] ?? "";
const labNotePartnersLinks = countVolantPartnersLinks(labNote);
if (labNotePartnersLinks !== 2) {
  failures.push(
    `index.html lab-note should contain exactly 2 Volant Partners homepage links, found ${labNotePartnersLinks}`,
  );
}
if (/\.lab-note a\s*\{[^}]*color\s*:\s*(?:#f2b293|var\(--orange)/i.test(indexHtml)) {
  failures.push("index.html lab-note links should inherit surrounding text color");
}
if (/\.lab-note \.wrap\s*\{[^}]*display\s*:\s*grid/i.test(indexHtml)) {
  failures.push(
    "index.html lab-note should not use the old two-column grid that prematurely wraps copy",
  );
}
if (!/\.step \.num\s*\{[^}]*border\s*:\s*1px solid #999/i.test(indexHtml)) {
  failures.push("index.html How it works .num markers need a 1px #999 border");
}
if (
  !/(?:\.step:nth-child\(4\) \.conn|\.step \.conn\.final)\s*\{[^}]*color\s*:\s*var\(--orange\)/i.test(
    indexHtml,
  )
) {
  failures.push(
    "index.html final How it works connector arrow should be orange",
  );
}
if (
  /\.step:nth-child\([123]\) \.conn\s*\{[^}]*color\s*:\s*var\(--orange\)/i.test(
    indexHtml,
  )
) {
  failures.push(
    "index.html earlier How it works connector arrows should remain neutral",
  );
}

const thesis = readFileSync(path.join(siteRoot, "thesis.html"), "utf8");
if (/\.tagline span\s*\{[^}]*border\s*:/i.test(thesis)) {
  failures.push("thesis.html tagline pillars should not have an outline border");
}

const engine = readFileSync(path.join(siteRoot, "engine.html"), "utf8");
if (!/\.lic \.kicker\s*\{[^}]*color\s*:\s*var\(--white\)/i.test(engine)) {
  failures.push("engine.html license kicker text should be white");
}

const community = readFileSync(path.join(siteRoot, "community.html"), "utf8");
if (!/\.col \.kicker\s*\{[^}]*color\s*:\s*var\(--white\)/i.test(community)) {
  failures.push("community.html roadmap kicker text should be white");
}
for (const label of ["Collaborate", "Showcase", "Release notes", "Questions"]) {
  const cardPattern = new RegExp(
    `<a[^>]+class="cap card-link"[^>]+aria-label="[^"]*${escapeRegExp(label)}[^"]*"`,
    "i",
  );
  if (!cardPattern.test(community))
    failures.push(
      `Community card is not a keyboard-reachable full-card link: ${label}`,
    );
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log(`Site audit passed (${publicFiles.length} public files checked).`);

function listFiles(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    if (entry === ".DS_Store") return [];
    return statSync(full).isDirectory() ? listFiles(full) : [full];
  });
}

function relative(file) {
  return path.relative(siteRoot, file);
}

function assertNoNestedAnchors(page, html) {
  const anchorStack = [];
  const tagPattern = /<\/?a\b[^>]*>/gi;
  let match;
  while ((match = tagPattern.exec(html))) {
    const tag = match[0];
    if (tag.startsWith("</")) {
      anchorStack.pop();
    } else if (anchorStack.length) {
      failures.push(
        `${page} contains a nested anchor near offset ${match.index}`,
      );
      return;
    } else {
      anchorStack.push(tag);
    }
  }
}

function assertHeaderButtonTypography(page, html) {
  const btnRule = html.match(/\.btn\{([^}]*)\}/);
  if (btnRule && !/font-weight:600\b/.test(btnRule[1])) {
    failures.push(
      `${page} local .btn rule changes header button label weight away from the shared 600`,
    );
  }

  const quietRule = html.match(/\.btn-quiet\{([^}]*)\}/);
  if (quietRule && !/font-weight:500\b/.test(quietRule[1])) {
    failures.push(
      `${page} local .btn-quiet rule changes header Platform label weight away from the shared 500`,
    );
  }
}

function assertEyebrowNotLinkColored(page, html) {
  for (const rule of cssRules(html)) {
    if (!rule.selector.includes(".eyebrow")) continue;
    if (rule.selector.includes(".dot")) continue;
    if (!/(^|[;{])\s*color\s*:/.test(rule.body)) continue;
    if (
      /color\s*:\s*(?:var\(--orange(?:-600)?\)|#f4c7b4|#f2b293|rgb\(209,\s*91,\s*33\))/i.test(
        rule.body,
      )
    ) {
      failures.push(`${page} eyebrow text should be white, not link-colored`);
      return;
    }
  }
}

function assertPassiveBandLaneNotOrange(page, html) {
  for (const rule of cssRules(html)) {
    if (!/\.band-head\s*(?:>\s*)?\.lane/.test(rule.selector)) continue;
    if (
      /color\s*:\s*(?:var\(--orange(?:-600)?\)|#f4c7b4|#f2b293|rgb\(209,\s*91,\s*33\))/i.test(
        rule.body,
      )
    ) {
      failures.push(
        `${page} passive band-head lane text should use standard text color`,
      );
      return;
    }
  }
}

function cssRules(source) {
  const rules = [];
  const pattern = /([^{}]+)\{([^{}]*)\}/g;
  let match;
  while ((match = pattern.exec(source))) {
    rules.push({ selector: match[1].trim(), body: match[2] });
  }
  return rules;
}

function assertVolantPartnersFooterLinks(page, html) {
  const footer = html.match(/<footer[\s\S]*?<\/footer>/)?.[0] ?? "";
  const linkCount = countVolantPartnersLinks(footer);
  if (linkCount < 1) {
    failures.push(
      `${page} footer should contain Volant Partners homepage links, found ${linkCount}`,
    );
  }
  if (footer.includes(`href="${volantPartnersUrl}" target="_self"`)) {
    failures.push(
      `${page} footer Volant Partners link should open in a new tab`,
    );
  }
}

function assertGa4Tracking(page, html) {
  if (new RegExp(`<script\\s+async\\s+src="${escapeRegExp(ga4ScriptUrl)}"\\s*>`).test(html)) {
    failures.push(`${page} loads GA4 before checking the production host`);
  }
  if (!html.includes(ga4ScriptUrl)) {
    failures.push(`${page} is missing the GA4 gtag.js loader for ${ga4MeasurementId}`);
  }
  if (
    !/new Set\(\["volantlabs\.ai", "www\.volantlabs\.ai"\]\)/.test(html) ||
    !/productionHosts\.has\(window\.location\.hostname\)/.test(html)
  ) {
    failures.push(`${page} is missing the GA4 production-host guard`);
  }
  if (!/window\.dataLayer\s*=\s*window\.dataLayer\s*\|\|\s*\[\]/.test(html)) {
    failures.push(`${page} is missing the GA4 dataLayer initialization`);
  }
  if (!/window\.gtag\s*=\s*function gtag\(\)\s*\{\s*window\.dataLayer\.push\(arguments\);\s*\}/.test(html)) {
    failures.push(`${page} is missing the GA4 gtag helper`);
  }
  if (!/window\.gtag\('js',\s*new Date\(\)\);/.test(html)) {
    failures.push(`${page} is missing the GA4 js initialization event`);
  }
  if (!new RegExp(`window\\.gtag\\('config',\\s*'${escapeRegExp(ga4MeasurementId)}'\\);`).test(html)) {
    failures.push(`${page} is missing the GA4 config call for ${ga4MeasurementId}`);
  }
}

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, " ").trim();
}

function stripTags(value) {
  return value.replace(/<[^>]+>/g, "");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function countVolantPartnersLinks(html) {
  return extractAnchors(html).filter((anchor) => {
    const classNames = (anchor.attributes.class ?? "").split(/\s+/);
    const relTokens = (anchor.attributes.rel ?? "").split(/\s+/);
    return (
      classNames.includes("volant-partners-link") &&
      anchor.attributes.href === volantPartnersUrl &&
      anchor.attributes.target === "_blank" &&
      relTokens.includes("noopener") &&
      relTokens.includes("noreferrer") &&
      normalizeWhitespace(stripTags(anchor.innerHtml)) === volantPartnersText
    );
  }).length;
}

function extractAnchors(html) {
  const anchors = [];
  const anchorPattern = /<a\b([^>]*)>([\s\S]*?)<\/a\s*>/gi;
  let match;
  while ((match = anchorPattern.exec(html))) {
    anchors.push({
      attributes: parseAttributes(match[1]),
      innerHtml: match[2],
    });
  }
  return anchors;
}

function parseAttributes(rawAttributes) {
  const attributes = {};
  const attributePattern = /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
  let match;
  while ((match = attributePattern.exec(rawAttributes))) {
    attributes[match[1].toLowerCase()] = match[2] ?? match[3] ?? "";
  }
  return attributes;
}
