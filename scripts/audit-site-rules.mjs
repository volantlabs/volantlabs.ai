export const ga4MeasurementId = "G-VNXWVPERBQ";
export const ga4CtaEventNames = Object.freeze([
  "cta_quickstart",
  "cta_repo",
  "cta_download_run_now",
  "cta_worked_model",
  "cta_feedback",
]);
export const volantPartnersContactUrl =
  "https://www.volantpartners.com/contact";

const ga4ScriptUrl = `https://www.googletagmanager.com/gtag/js?id=${ga4MeasurementId}`;

export function ga4TrackingFailures(page, html) {
  if (extractMetaContentByName(html, "volant-network-policy") === "no-third-party") {
    return thirdPartyAutoLoadFailures(page, html);
  }

  const failures = [];
  if (hasUnguardedAsyncGa4Loader(html)) {
    failures.push(`${page} loads GA4 before checking the production host`);
  }
  if (!html.includes(ga4ScriptUrl)) {
    failures.push(
      `${page} is missing the GA4 gtag.js loader for ${ga4MeasurementId}`,
    );
  }
  if (!hasProductionHostGuard(html)) {
    failures.push(`${page} is missing the GA4 production-host guard`);
  }
  if (!/window\.dataLayer\s*=\s*window\.dataLayer\s*\|\|\s*\[\]/.test(html)) {
    failures.push(`${page} is missing the GA4 dataLayer initialization`);
  }
  if (
    !/window\.gtag\s*=\s*function gtag\(\)\s*\{\s*window\.dataLayer\.push\(arguments\);\s*\}/.test(
      html,
    )
  ) {
    failures.push(`${page} is missing the GA4 gtag helper`);
  }
  if (!/window\.gtag\s*\(\s*["']js["']\s*,\s*new Date\(\)\s*\);/.test(html)) {
    failures.push(`${page} is missing the GA4 js initialization event`);
  }
  if (
    !new RegExp(
      `window\\.gtag\\s*\\(\\s*["']config["']\\s*,\\s*["']${escapeRegExp(ga4MeasurementId)}["']\\s*\\);`,
    ).test(html)
  ) {
    failures.push(`${page} is missing the GA4 config call for ${ga4MeasurementId}`);
  }
  return failures;
}

export function ga4CtaPageFailures(page, html) {
  if (extractMetaContentByName(html, "volant-network-policy") === "no-third-party") {
    return [];
  }
  if (!/\bdata-ga-event\s*=/.test(html)) return [];

  const depth = page.replaceAll("\\", "/").split("/").length - 1;
  const expectedSrc = `${"../".repeat(depth)}assets/ga4-cta.js`;
  const helperPattern = new RegExp(
    `<script\\b(?=[^>]*\\bdefer\\b)(?=[^>]*\\bsrc\\s*=\\s*["']${escapeRegExp(expectedSrc)}["'])[^>]*>`,
    "i",
  );
  return helperPattern.test(html)
    ? []
    : [`${page} is missing the shared GA4 CTA helper at ${expectedSrc}`];
}

export function ga4CtaCoverageFailures(files) {
  const corpus = files.map(({ content }) => content).join("\n");
  return ga4CtaEventNames
    .filter(
      (eventName) =>
        !new RegExp(
          `\\bdata-ga-event\\s*=\\s*["']${escapeRegExp(eventName)}["']`,
          "i",
        ).test(corpus),
    )
    .map((eventName) => `Named CTA coverage is missing ${eventName}`);
}

export function ga4CtaAssetFailures(source) {
  const failures = ga4CtaEventNames
    .filter((eventName) => !source.includes(eventName))
    .map((eventName) => `GA4 CTA helper is missing ${eventName}`);

  if (
    !/document\.addEventListener\(\s*["']click["'][\s\S]*?\.closest\(\s*["']\[data-ga-event\]["']\s*\)/.test(
      source,
    )
  ) {
    failures.push(
      "GA4 CTA helper is missing delegated data-ga-event click handling",
    );
  }
  if (
    !/typeof window\.gtag\s*!==\s*["']function["'][\s\S]*?window\.gtag\(\s*["']event["']/.test(
      source,
    )
  ) {
    failures.push("GA4 CTA helper is missing a guarded gtag event dispatch");
  }

  return failures;
}

export function thirdPartyAutoLoadFailures(page, html) {
  const failures = new Set();
  const tagPattern = /<(script|link|img|iframe|source|video|audio)\b([^>]*)>/gi;
  let match;
  while ((match = tagPattern.exec(html))) {
    const tag = match[1].toLowerCase();
    const attributes = parseAttributes(match[2]);
    const relTokens = (attributes.rel ?? "").toLowerCase().split(/\s+/);
    const linkAutoLoads = tag === "link" && relTokens.some((token) =>
      ["stylesheet", "preconnect", "prefetch", "dns-prefetch", "preload", "modulepreload"].includes(token));
    const url = tag === "link"
      ? linkAutoLoads ? attributes.href : null
      : attributes.src ?? attributes.poster ?? null;
    if (isThirdPartyUrl(url)) {
      failures.add(`${page} declares no-third-party network policy but auto-loads ${url}`);
    }
  }

  const dynamicUrlPatterns = [
    /(?:fetch|WebSocket|EventSource)\s*\(\s*["']((?:https?:)?\/\/[^"']+)/gi,
    /\.src\s*=\s*["']((?:https?:)?\/\/[^"']+)/gi,
  ];
  for (const pattern of dynamicUrlPatterns) {
    let dynamicMatch;
    while ((dynamicMatch = pattern.exec(html))) {
      if (isThirdPartyUrl(dynamicMatch[1])) {
        failures.add(`${page} declares no-third-party network policy but auto-loads ${dynamicMatch[1]}`);
      }
    }
  }

  return [...failures];
}

export function externalContactLinkFailures(page, html) {
  const failures = [];
  const contactLinks = extractAnchors(html).filter(
    (anchor) => anchor.attributes.href === volantPartnersContactUrl,
  );

  for (const contact of contactLinks) {
    const label = contact.attributes["aria-label"] ?? "";
    if (
      !/\bVolant Partners\b/.test(label) ||
      !/\bvolantpartners\.com\b/.test(label)
    ) {
      failures.push(
        `${page} Contact link should identify Volant Partners and the volantpartners.com domain`,
      );
    }

    const relTokens = (contact.attributes.rel ?? "").split(/\s+/);
    if (
      contact.attributes.target !== "_blank" ||
      !relTokens.includes("noopener") ||
      !relTokens.includes("noreferrer")
    ) {
      failures.push(
        `${page} Contact link should open in a new tab with noopener and noreferrer`,
      );
    }
  }

  return failures;
}

export function seoBaselineFailures(page, html, expectedCanonical) {
  const failures = [];

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].replace(/\s+/g, " ").trim() : "";
  if (!title) {
    failures.push(`${page} is missing a non-empty <title>`);
  }

  const description = extractMetaContentByName(html, "description");
  if (!description || !description.trim()) {
    failures.push(`${page} is missing a non-empty meta description`);
  }

  const canonical = extractCanonicalHref(html);
  if (!canonical) {
    failures.push(`${page} is missing a canonical link`);
  } else if (expectedCanonical && canonical !== expectedCanonical) {
    failures.push(
      `${page} canonical expected "${expectedCanonical}" but found "${canonical}"`,
    );
  }

  return failures;
}

export function jsonLdFailures(page, html, { required = false } = {}) {
  const failures = [];
  const blockPattern =
    /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script\s*>/gi;
  let match;
  let blockCount = 0;
  while ((match = blockPattern.exec(html))) {
    blockCount += 1;
    try {
      JSON.parse(match[1]);
    } catch {
      failures.push(
        `${page} JSON-LD block ${blockCount} does not parse as valid JSON`,
      );
    }
  }
  if (required && blockCount === 0) {
    failures.push(`${page} is missing a required JSON-LD block`);
  }
  return failures;
}

export function forbiddenPatternFailures(files, patterns) {
  const failures = [];

  for (const pattern of patterns) {
    const offenders = files
      .filter(({ content }) => pattern.test(content))
      .map(({ name }) => name);
    if (offenders.length) {
      failures.push(
        `Forbidden pattern ${pattern} found in ${offenders.join(", ")}`,
      );
    }
  }

  return failures;
}

function hasUnguardedAsyncGa4Loader(html) {
  return new RegExp(
    `<script\\b(?=[^>]*\\basync\\b)(?=[^>]*\\bsrc\\s*=\\s*["']${escapeRegExp(ga4ScriptUrl)}["'])[^>]*>`,
  ).test(html);
}

function hasProductionHostGuard(html) {
  return (
    /new\s+Set\s*\(\s*\[[\s\S]*?["']volantlabs\.ai["'][\s\S]*?["']www\.volantlabs\.ai["'][\s\S]*?\]\s*\)/.test(
      html,
    ) &&
    /productionHosts\s*\.\s*has\s*\(\s*window\s*\.\s*location\s*\.\s*hostname\s*\)/.test(
      html,
    )
  );
}

function isThirdPartyUrl(value) {
  if (!value || !/^(?:https?:)?\/\//i.test(value)) return false;
  try {
    const hostname = new URL(value, "https://volantlabs.ai").hostname.toLowerCase();
    return hostname !== "volantlabs.ai" && hostname !== "www.volantlabs.ai";
  } catch {
    return true;
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractMetaContentByName(html, name) {
  const metaPattern = /<meta\b([^>]*)>/gi;
  let match;
  while ((match = metaPattern.exec(html))) {
    const attrs = parseAttributes(match[1]);
    if (attrs.name === name) return attrs.content ?? null;
  }
  return null;
}

function extractCanonicalHref(html) {
  const linkPattern = /<link\b([^>]*)>/gi;
  let match;
  while ((match = linkPattern.exec(html))) {
    const attrs = parseAttributes(match[1]);
    if (attrs.rel === "canonical") return attrs.href ?? null;
  }
  return null;
}

function extractAnchors(html) {
  const anchors = [];
  const anchorPattern = /<a\b([^>]*)>([\s\S]*?)<\/a\s*>/gi;
  let match;
  while ((match = anchorPattern.exec(html))) {
    anchors.push({ attributes: parseAttributes(match[1]) });
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
