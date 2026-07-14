#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  externalContactLinkFailures,
  forbiddenPatternFailures,
  ga4TrackingFailures,
} from "./audit-site-rules.mjs";

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
  "volant-labs-favicon.svg",
);
const socialPreviewManifestPath = path.join(
  siteRoot,
  "assets",
  "images",
  "social",
  "manifest.json",
);
const publicFiles = listFiles(siteRoot)
  .filter((file) => /\.(html|js|xml|json|css)$/.test(file))
  .filter((file) => !file.includes(`${path.sep}design${path.sep}`))
  .filter((file) => !file.includes(`${path.sep}scripts${path.sep}`));
const publicHtmlFiles = publicFiles.filter((file) => file.endsWith(".html"));
const publicCopyFiles = listFiles(siteRoot)
  .filter((file) => /\.(html|js|xml|json|css|md|txt)$/.test(file))
  .filter((file) => !file.includes(`${path.sep}design${path.sep}`))
  .filter((file) => !file.includes(`${path.sep}scripts${path.sep}`))
  .filter((file) => path.basename(file) !== "README.md");

const requiredStrings = [
  "https://github.com/volantlabs/vellis",
  "https://github.com/volantlabs/vellis/releases",
  "https://github.com/volantlabs/vellis/issues",
  "git clone https://github.com/volantlabs/vellis.git",
  "labs@volantpartners.com",
  "https://www.volantpartners.com/contact",
  "Volant Partners helps teams turn complex technical work into reliable products, operations, and decisions.",
  "volant-labs-flask-mark.svg",
  "volant-labs-favicon.svg",
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
  new RegExp("sysml-" + "foundation", "i"),
  new RegExp("knowledge layer agents can " + "share", "i"),
  new RegExp("https://kesher\\.volantpartners\\.ai/files/" + "download"),
  new RegExp('<line x1=\\"6\\" y1=\\"6\\" x2=\\"18\\" y2=\\"18\\"'),
  new RegExp(
    '<circle cx=\\"6\\" cy=\\"18\\" r=\\"2\\\\.4\\" fill=\\"#D15B21\\"',
  ),
  new RegExp("M10 3v5\\.2L5\\.9 17\\.1C5 19\\.1"),
];

const failures = [];
const socialPreviewManifest = readSocialPreviewManifest();
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

failures.push(
  ...forbiddenPatternFailures(
    publicCopyFiles.map((file) => ({
      name: relative(file),
      content: readFileSync(file, "utf8"),
    })),
    forbiddenPatterns,
  ),
);

const kesherCopyAllowlist = new Set([
  path.join(siteRoot, "platform.html"),
  path.join(siteRoot, "llms", "pages", "platform.md"),
  socialPreviewManifestPath,
]);
const kesherCopyOffenders = publicCopyFiles.filter(
  (file) =>
    !kesherCopyAllowlist.has(file) &&
    /\bkesher\b/i.test(readFileSync(file, "utf8")),
);
if (kesherCopyOffenders.length) {
  failures.push(
    `Public site copy mentions Kesher outside the approved Platform path in ${kesherCopyOffenders.map(relative).join(", ")}`,
  );
}

for (const file of publicHtmlFiles) {
  const html = readFileSync(file, "utf8");
  assertGa4Tracking(relative(file), html);
  assertExternalContactSignals(relative(file), html);
}

assertSocialPreviewManifest();

const handAuthoredPages = [
  "index.html",
  "engine.html",
  "thesis.html",
  "perspectives.html",
  "community.html",
  "platform.html",
  "domain-explorations.html",
];
const firstViewportRhythmClasses = new Map([
  ["engine.html", /<section\s+class="hero hero-rhythm"/],
  ["thesis.html", /<section\s+[^>]*class="hero hero-rhythm hero-rhythm-story"/],
  ["perspectives.html", /<section\s+class="pagehead pagehead-rhythm"/],
  ["community.html", /<section\s+class="pagehead pagehead-rhythm"/],
  ["platform.html", /<section\s+class="hero hero-rhythm"/],
  ["domain-explorations.html", /<section\s+class="pagehead pagehead-rhythm"/],
]);

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
    !/<link\s+rel="icon"\s+href="assets\/logos\/volant-labs-favicon\.svg"\s+type="image\/svg\+xml"\s*\/?>/.test(
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
  assertFirstViewportRhythm(page, html);
  assertSharedNavBreakpoint(page, html);
  assertLocalGhostButtonBorder(page, html);
}

const generatedArticle = readFileSync(
  path.join(siteRoot, "perspectives", "runtime-controls.html"),
  "utf8",
);
const generatedOpenDataArticle = readFileSync(
  path.join(siteRoot, "perspectives", "open-data.html"),
  "utf8",
);
const indexHtml = readFileSync(path.join(siteRoot, "index.html"), "utf8");
const sharedCss = readFileSync(
  path.join(siteRoot, "assets", "site.css"),
  "utf8",
);
assertSharedFirstViewportRhythm(sharedCss);
assertSharedA11yContrast(sharedCss);
if (
  !/<link\s+rel="icon"\s+href="assets\/logos\/volant-labs-favicon\.svg"\s+type="image\/svg\+xml"\s*\/?>/.test(
    indexHtml,
  )
) {
  failures.push(
    "index.html is missing the relative Volant Labs SVG favicon link",
  );
}
if (/href="\/assets\/logos\/volant-labs-favicon\.svg"/.test(indexHtml)) {
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
assertGeneratedContributorAvatar(
  "perspectives/runtime-controls.html",
  generatedArticle,
  "Matthew Lou-Magnuson",
  "../assets/images/contributors/matthew-lou-magnuson.png",
);
assertGeneratedContributorAvatar(
  "perspectives/open-data.html",
  generatedOpenDataArticle,
  "Andrew Forman",
  "../assets/images/contributors/andrew-forman.png",
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
  !/(?:\.step:nth-child\(4\) \.conn|\.step \.conn\.final)\s*\{[^}]*background\s*:\s*var\(--orange\)[^}]*color\s*:\s*var\(--labs-base\)/i.test(
    indexHtml,
  )
) {
  failures.push(
    "index.html final How it works connector should use an orange fill with AA dark text",
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
if (!/\.license-kicker\s*\{[^}]*color\s*:\s*var\(--white\)/i.test(engine)) {
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
    if (entry === ".DS_Store" || entry === "node_modules") return [];
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

function assertExternalContactSignals(page, html) {
  failures.push(...externalContactLinkFailures(page, html));
}

function assertFirstViewportRhythm(page, html) {
  const expected = firstViewportRhythmClasses.get(page);
  if (!expected) return;
  if (!expected.test(html)) {
    failures.push(`${page} is missing the shared first-viewport rhythm class`);
  }
}

function assertSharedNavBreakpoint(page, html) {
  if (page !== "thesis.html" && page !== "perspectives.html") return;
  if (/@media\s*\(max-width:\s*980px\)\s*\{[\s\S]{0,700}?nav\s*\{/.test(html)) {
    failures.push(
      `${page} reintroduces the old 980px local nav wrap breakpoint`,
    );
  }
  if (/\.navlinks\s*\{[^}]*?(?:gap|margin-left)\s*:\s*var\(--s6\)/.test(html)) {
    failures.push(`${page} local nav spacing should match shared nav spacing`);
  }
  if (/\.navlinks a\.active\s*\{[^}]*font-weight\s*:\s*700/.test(html)) {
    failures.push(`${page} active nav weight should match shared nav weight`);
  }
}

function assertLocalGhostButtonBorder(page, html) {
  if (page !== "thesis.html" && page !== "perspectives.html") return;
  const ghostRule = cssRules(html).find((rule) => rule.selector === ".btn-ghost");
  if (!ghostRule || !/border-color\s*:\s*var\(--line\)/.test(ghostRule.body)) {
    failures.push(
      `${page} local .btn rule overrides shared Contact outline without restoring .btn-ghost border color`,
    );
  }
}

function assertGeneratedContributorAvatar(page, html, alt, src) {
  const pattern = new RegExp(
    `<img\\s+src="${escapeRegExp(src)}"\\s+alt="${escapeRegExp(alt)}"`,
  );
  if (!pattern.test(html)) {
    failures.push(`${page} is missing ${alt}'s contributor headshot`);
  }
}

function assertSharedFirstViewportRhythm(css) {
  const requiredSnippets = [
    ".hero.hero-rhythm > .wrap",
    ".pagehead.pagehead-rhythm > .wrap{padding-top:var(--s24)}",
    ".hero.hero-rhythm .hero-copy{align-self:start}",
    ".hero.hero-rhythm-story{align-items:flex-start}",
    "@media(max-width:760px)",
    ".pagehead.pagehead-rhythm > .wrap{padding-left:20px;padding-right:20px}",
  ];
  for (const snippet of requiredSnippets) {
    if (!css.includes(snippet)) {
      failures.push(
        `Shared CSS is missing first-viewport rhythm rule: ${snippet}`,
      );
    }
  }
}

function assertSharedA11yContrast(css) {
  const requiredSnippets = [
    ".skip{position:absolute;left:var(--s4);top:-48px;background:var(--labs-accent);color:var(--labs-base);font-weight:700",
    ".btn-primary{background:var(--orange);color:var(--labs-base)}",
    ".btn-primary:hover{background:var(--orange-600);color:#fff}",
    'a[href="https://www.volantpartners.com/contact"]::after',
  ];
  for (const snippet of requiredSnippets) {
    if (!css.includes(snippet)) {
      failures.push(`Shared CSS is missing accessible contrast/domain cue rule: ${snippet}`);
    }
  }

  for (const rule of cssRules(css)) {
    if (/color\s*:\s*var\(--orange\)/.test(rule.body)) {
      failures.push(
        `Shared CSS uses brand orange as text in ${rule.selector}; use an AA text token on dark surfaces`,
      );
    }
  }
}

function assertGa4Tracking(page, html) {
  failures.push(...ga4TrackingFailures(page, html));
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

function readSocialPreviewManifest() {
  if (!existsSync(socialPreviewManifestPath)) {
    failures.push(
      `Missing social preview manifest: ${relative(socialPreviewManifestPath)}`,
    );
    return [];
  }
  const raw = JSON.parse(readFileSync(socialPreviewManifestPath, "utf8"));
  if (!Array.isArray(raw) || !raw.length) {
    failures.push("Social preview manifest must contain preview records");
    return [];
  }
  return raw;
}

function assertSocialPreviewManifest() {
  const byPage = new Map();
  const images = new Set();
  const htmlPages = publicFiles
    .filter((file) => file.endsWith(".html"))
    .map((file) => htmlPageForFile(file));

  for (const [index, preview] of socialPreviewManifest.entries()) {
    const sourceRef = `assets/images/social/manifest.json[${index}]`;
    for (const field of [
      "page",
      "title",
      "description",
      "twitterTitle",
      "twitterDescription",
      "image",
      "width",
      "height",
      "alt",
    ]) {
      if (preview[field] === undefined || preview[field] === null || preview[field] === "") {
        failures.push(`${sourceRef} missing required field ${field}`);
      }
    }

    const page = normalizeSocialPage(preview.page ?? "");
    if (byPage.has(page)) {
      failures.push(`Duplicate social preview manifest page: ${page}`);
    }
    byPage.set(page, preview);

    if (preview.width !== 1200 || preview.height !== 630) {
      failures.push(`${sourceRef} must declare 1200x630 dimensions`);
    }
    if (typeof preview.image !== "string" || !preview.image.startsWith("assets/images/social/") || !preview.image.endsWith(".png")) {
      failures.push(`${sourceRef} image must be a PNG under assets/images/social/`);
      continue;
    }
    if (images.has(preview.image)) {
      failures.push(`Social preview image is reused: ${preview.image}`);
    }
    images.add(preview.image);

    const imagePath = path.join(siteRoot, preview.image);
    if (!existsSync(imagePath)) {
      failures.push(`${sourceRef} image does not exist: ${preview.image}`);
    } else {
      const dimensions = readPngDimensions(imagePath);
      if (!dimensions) {
        failures.push(`${sourceRef} image is not a readable PNG: ${preview.image}`);
      } else if (dimensions.width !== 1200 || dimensions.height !== 630) {
        failures.push(
          `${sourceRef} image has ${dimensions.width}x${dimensions.height}; expected 1200x630`,
        );
      }
    }

    const htmlFile = htmlFileForSocialPage(page);
    if (!existsSync(htmlFile)) {
      failures.push(`${sourceRef} page does not exist: ${page}`);
      continue;
    }
    const html = readFileSync(htmlFile, "utf8");
    const htmlName = relative(htmlFile);
    const imageUrl = `https://volantlabs.ai/${preview.image}`;
    assertMetaEquals(htmlName, html, "property", "og:title", preview.title);
    assertMetaEquals(htmlName, html, "property", "og:description", preview.description);
    assertMetaEquals(htmlName, html, "property", "og:image", imageUrl);
    assertMetaEquals(htmlName, html, "property", "og:image:width", String(preview.width));
    assertMetaEquals(htmlName, html, "property", "og:image:height", String(preview.height));
    assertMetaEquals(htmlName, html, "property", "og:image:alt", preview.alt);
    assertMetaEquals(htmlName, html, "name", "twitter:card", "summary_large_image");
    assertMetaEquals(htmlName, html, "name", "twitter:title", preview.twitterTitle);
    assertMetaEquals(htmlName, html, "name", "twitter:description", preview.twitterDescription);
    assertMetaEquals(htmlName, html, "name", "twitter:image", imageUrl);
    assertMetaEquals(htmlName, html, "name", "twitter:image:alt", preview.alt);
  }

  for (const page of htmlPages) {
    if (!byPage.has(page)) {
      failures.push(`Public HTML page is missing from social preview manifest: ${page}`);
    }
  }

  for (const file of publicFiles.filter((item) => item.endsWith(".html"))) {
    const html = readFileSync(file, "utf8");
    for (const attrName of ["og:image", "twitter:image"]) {
      const attrType = attrName.startsWith("og:") ? "property" : "name";
      const value = extractMetaContent(html, attrType, attrName);
      if (value && /\.webp(?:$|\?)/i.test(value)) {
        failures.push(`${relative(file)} ${attrName} must not use WebP: ${value}`);
      }
    }
  }
}

function normalizeSocialPage(page) {
  if (page === "/" || page === "") return "/";
  return page.startsWith("/") ? page : `/${page}`;
}

function htmlFileForSocialPage(page) {
  return path.join(siteRoot, page === "/" ? "index.html" : page.slice(1));
}

function htmlPageForFile(file) {
  const page = `/${relative(file).replaceAll(path.sep, "/")}`;
  return page === "/index.html" ? "/" : page;
}

function assertMetaEquals(page, html, attrType, attrName, expected) {
  const actual = extractMetaContent(html, attrType, attrName);
  if (actual !== expected) {
    failures.push(
      `${page} ${attrName} expected "${expected}" but found "${actual ?? "missing"}"`,
    );
  }
}

function extractMetaContent(html, attrType, attrName) {
  const metaPattern = /<meta\b([^>]*)>/gi;
  let match;
  while ((match = metaPattern.exec(html))) {
    const attrs = parseAttributes(match[1]);
    if (attrs[attrType] === attrName) return attrs.content ?? null;
  }
  return null;
}

function readPngDimensions(filePath) {
  const bytes = readFileSync(filePath);
  if (
    bytes.length < 24 ||
    bytes[0] !== 0x89 ||
    bytes[1] !== 0x50 ||
    bytes[2] !== 0x4e ||
    bytes[3] !== 0x47
  ) {
    return null;
  }
  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
  };
}
